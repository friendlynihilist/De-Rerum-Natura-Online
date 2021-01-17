import * as N3 from 'n3';
import { DataFactory } from 'rdf-data-factory';

export const parser = {
  parseMedia(item) {
    let mediaUrl = item['o:media'].map((field) => field['@id']);

    fetch(mediaUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data['o:original_url']) {
          item.original_url = data['o:original_url'];
        } else {
            const stripUrl = this.getId(data["o:source"]);
            item.video_source = 'https://www.youtube.com/embed/' + stripUrl;
        }
      });
    return item;
  },

  parseSimpleMedia(item) {
    let mediaUrl = item['o:media'].map((field) => field['@id']);

    fetch(mediaUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data['o:original_url']) {
          item.original_url = data['o:original_url'];
        } else {
          const stripUrl = this.getId(data["o:source"]);
          item.video_source = 'https://www.youtube.com/watch?v=' + stripUrl;
        }
      });
    return item;
  },

  parseRDF(item) {
    item.ref_count = 0;
    fetch('../../assets/tei-ref/de-rerum-natura.nt')
      .then((response) => response.text())
      .then((data) => {
        // Do something with your data
        const parser = new N3.Parser({ format: 'N-Triples' });
        parser.parse(data, (error, quad, prefixes) => {
          const factory = new DataFactory();
          const store = new N3.Store();

          store.addQuad(quad); // .addQuads
          const uri = item['@id'];
          const searchQuad = store.getQuads(factory.namedNode(uri));
          for (const quad of searchQuad) {
            if (quad.subject.value === uri) {
              item.ref_count++;
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
    let baseUrl = 'http://localhost:4200';
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
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  },

};
