import * as N3 from 'n3';
import { DataFactory } from 'rdf-data-factory';

export const parser = {
  parseMedia(item) {
    
    // let mediaUrl = item['o:media'].map((field) => field['@id']); 
    item.original_url = [];
    item.video_source = [];
    
    for (let media of item['o:media']) {
      fetch(media['@id'])
        .then((response) => response.json())
        .then((data) => {
          if (data['o:original_url']) {
            //FIXME: items can have multiple media. so this should be an object rather than a shallow property.
            item.original_url.push(data['o:original_url']); // create a original_url property into item
          } else {
            const stripUrl = this.getId(data['o:source']);
            item.video_source.push('https://www.youtube.com/embed/' + stripUrl); // create a video_source property into item
          }
        });
    }

    return item;
  },

  parseSimpleMedia(item) {
    // let mediaUrl = item['o:media'].map((field) => field['@id']);

    for (let media of item['o:media']) {
      fetch(media['@id'])
        .then((response) => response.json())
        .then((data) => {
          if (data['o:original_url']) {
            item.original_url = data['o:original_url'];
          } else {
            const stripUrl = this.getId(data['o:source']);
            item.video_source = 'https://www.youtube.com/watch?v=' + stripUrl;
          }
        });
    }

    return item;
  },

  parseRDF(item) {
    item.ref_count = 0;
    item.has_object = '';
    item.has_fragment;
    item.has_selector;
    item.has_target;
    item.has_text;
    item.has_xpath;
    fetch('../../assets/tei-ref/de-rerum-natura.nt')
      .then((response) => response.text())
      .then((data) => {
        const parser = new N3.Parser({ format: 'N-Triples' });
        parser.parse(data, (error, quad, prefixes) => {
          const factory = new DataFactory();
          const store = new N3.Store();

          store.addQuad(quad); // .addQuads
          const uri = item['@id'];
          const searchQuad = store.getQuads(factory.namedNode(uri));
          for (const quad of searchQuad) {
            if (
              quad.subject.value === uri &&
              quad.predicate.value === 'rdfs:seeAlso'
            ) {
              item.ref_count++;
              item.has_object = quad.object.value;
            }
          }
          const searchQuadB = store.getQuads(
            factory.namedNode(item.has_object)
          );
          for (const quadB of searchQuadB) {
            if (
              quadB.subject.value === item.has_object &&
              quadB.predicate.value === 'http://www.w3.org/ns/oa#hasBody' &&
              quadB.object.value === uri
            ) {
              item.has_fragment = 'true';
            }
          }
          const searchQuadC = store.getQuads(
            factory.namedNode(item.has_object)
          );
          for (const quadC of searchQuadC) {
            if (
              quadC.subject.value === item.has_object &&
              quadC.predicate.value === 'http://www.w3.org/ns/oa#hasTarget'
            ) {
              item.has_target = quadC.object.value;
            }
          }

          const searchQuadD = store.getQuads(
            factory.namedNode(item.has_target)
          );
          for (const quadD of searchQuadD) {
            if (
              quadD.subject.value === item.has_target &&
              quadD.predicate.value === 'http://www.w3.org/ns/oa#hasSelector'
            ) {
              item.has_selector = quadD.object.value;
            }
          }

          const searchQuadE = store.getQuads(
            factory.namedNode(item.has_selector)
          );
          for (const quadE of searchQuadE) {
            if (
              quadE.subject.value === item.has_selector &&
              quadE.predicate.value === 'rdf:value'
            ) {
              item.has_xpath = quadE.object.value;
            }
            if (
              quadE.subject.value === item.has_selector &&
              quadE.predicate.value === 'rdf:text'
            ) {
              item.has_text = quadE.object.value;
            }
          }
        });
      });
    return item;
  },

  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  },

  buildLink(obj) {
    let baseUrl = 'http://localhost:4200'; // FIXME: move to config
    return `${baseUrl}/work/${obj['value_resource_id']}/${this.slugify(
      obj['display_title']
    )}`;
  },

  isValid(string) {
    if (/dcterms/.test(string)) {
      return true;
    } else return false;
  },

  getId(url) {
    if (url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
  
      return match && match[2].length === 11 ? match[2] : null;
    }
  },
};
