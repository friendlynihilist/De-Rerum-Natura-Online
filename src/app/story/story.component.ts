import { Component, OnInit, Renderer2 } from '@angular/core';
import * as N3 from 'n3';
import { DataFactory } from 'rdf-data-factory';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parser } from '../parsers';
import { TL, Timeline } from '@knight-lab/timelinejs/src/js/index';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {
  constructor(private http: HttpClient, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.fetchItems();
    // this.parseRDF();
    // this.createDataModel();
    // this.topicArray_3 = this.topicArray_2;
    // this.convertArray(this.topicArray_2);
    this.createButtons(this.topicArray);
    this.parseTopic('http://www.example.com/topic_1');
    // this.parseRDF();
    // this.createDataModel();
    console.log(this.topicArray);
    console.log(this.topicArray_2);
  }
  
  topicArray = [
    {
      "http://www.example.com/topic_1": {
        "title": "Lucrezio",
        "body": "<p>La Peste d'Atene, inserita nel finale del <i>De rerum natura</i>, è una rielaborazione della descrizione fatta da <a href='http://viaf.org/viaf/95161463/#Thucydides' class='entity-person'>Tucidide</a> (<i>Storie</i> 2,47-54) dell’epidemia che colpì la citta greca nel 431/430 a.C., alla fine del primo anno della guerra del Peloponneso. L’operazione di Lucrezio non è una semplice ‘traduzione’, che si risolve in un passaggio di codice (dal greco al latino) e di genere (dalla storiografia al poema didascalico): è piuttosto una riscrittura dell’<i>excursus</i> tucidideo per renderlo funzionale all’impianto filosofico del poema lucreziano. Secondo la filosofia di Epicuro, seguita da Lucrezio, ogni cosa è formata da atomi che costantemente si aggregano e disgregano sotto la spinta di movimenti che portano la vita (<i>motus genitales</i>) e movimenti che portano la morte (<i>motus exitiales</i>): nel <i>De rerum natura</i> tale condizione è iconicamente rappresentata per mezzo della responsione a distanza tra il proemiale ‘inno a Venere’ – inno al ‘piacere’, alla voluptas che porta alla nascita delle cose –  e il finale, costituito appunto dalla peste di Atene, che si configura come un vero e proprio triumphus mortis. Ma nel sistema filosofico di Epicuro nascita e morte sono due movimenti che si implicano vicendevolmente, la cui eterna alternanza produce l’eterno divenire delle cose; per questo un lettore attento del <i>De rerum natura</i> sa che la peste d’Atene non è solo il finale del poema: è il presupposto per ricominciarne la lettura, per rileggere l’inno a Venere.</p>",
        "named_entities": [
          {
            "person": {
              "label": "Tucidide",
              "url": "http://viaf.org/viaf/95161463/#Thucydides",
              "rdf_value": "http://www.example.com/Thucydides"
            }
          },
          {
            "person": {
              "label": "Rasputin",
              "url": "http://viaf.org/viaf/95161463/#Rasputin",
              "rdf_value": "http://www.example.com/Rasputin"
            }
          }
        ]
      },
      "http://www.example.com/topic_2": {
        "title": "Secondo",
        "body": "<p>Nell’aprile del 1958 Arturo Schwarz pubblica De rerum natura, una cartella, stampata in 51 esemplari, che raccoglie 36 acqueforti di Enrico Baj. A questo progetto Baj iniziò a lavorare già nel 1952, cioè lo stesso anno in cui lanciava, assieme a Sergio Dangelo, il primo manifesto del Movimento Nucleare. Tra il 1952 e il 1953 Baj incide circa sessanta lastre, sperimentando cosi una tecnica che lo costringe a misurarsi con un tratto sottile, continuo e nitido; sceglie poi di riorganizzare il materiale in maniera autonoma rispetto al testo di Lucrezio selezionando 36 incisioni, che vengono a formare tre sezioni di dodici elementi l’una: le storie del sole (1-12), della vita (13-24) e della morte (25-36). «Sotto l’occhio vigile del sole, il primitivo disordine informale gradatamente perviene a organizzarsi, fino all’emergere delle presenze umane, sino alla storia dei rapporti tra uomo e donna, ai suoi giochi sociali (la musica, la danza, la toeletta) e alle sue tragedie (la guerra, la pestilenza, la morte), per narrare infine il disfacimento del tutto e il suo ciclico restituirsi al caos originario» (Arturo Schwarz).</p>",
        "named_entities": [
          {
            "person": {
              "label": "Arturo Schwarz",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Arturo_Schwarz"
            }
          }
        ]
      },
      "http://www.example.com/topic_3": {
        "title": "Terzo",
        "body": "<p>Questo è il terzo topic</p>",
        "named_entities": [
          {
            "item": {
              "label": "Excalibur",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          }
        ]
      },
      "http://www.example.com/topic_4": {
        "title": "Quarto",
        "body": "<p>Questo è il quarto topic</p>",
        "named_entities": [
          {
            "item": {
              "label": "Excalibur",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          }
        ]
      },
      "http://www.example.com/topic_5": {
        "title": "Quinto",
        "body": "<p>Questo è il quinto topic</p>",
        "named_entities": [
          {
            "item": {
              "label": "Excalibur",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          }
        ]
      },
      "http://www.example.com/topic_6": {
        "title": "Sesto",
        "body": "<p>Questo è il sesto topic</p>",
        "named_entities": [
          {
            "item": {
              "label": "Excalibur",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          }
        ]
      },
      "http://www.example.com/topic_7": {
        "title": "Settimo",
        "body": "<p>Questo è il settimo topic</p>",
        "named_entities": [
          {
            "item": {
              "label": "Excalibur",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          }
        ]
      },
      "http://www.example.com/topic_8": {
        "title": "Ottavo",
        "body": "<p>Questo è il ottavo topic</p>",
        "named_entities": [
          {
            "item": {
              "label": "Excalibur",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          }
        ]
      },
      "http://www.example.com/topic_9": {
        "title": "Nono",
        "body": "<p>Questo è il nono topic</p>",
        "named_entities": [
          {
            "item": {
              "label": "Excalibur",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          }
        ]
      }
    }
  ];
  topicArray_2 = [];

  buttonArray = [];

  loadedItems = [];
  timeline_json = {
    events: [],
  };
  options = {
    debug: true,
  };

  fetchItems() {
    this.http
      .get('https://137.204.168.14/lib/api/items')
      .pipe(
        map((responseData) => {
          const itemsArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              itemsArray.push({ ...responseData[key] });
            }
          }
          return itemsArray;
        })
      )
      .subscribe((items) => {
        items.map((item) =>
          this.loadedItems.push(parser.parseSimpleMedia(item))
        );
        this.buildTimeline(this.loadedItems);
        new Timeline('timeline-embed', this.timeline_json, this.options);
      });
  }

  parseRDF() {
    let topicArray = {};
    fetch('../../assets/tei-ref/de-rerum-natura.nt')
      .then((response) => response.text())
      .then((data) => {
        const parser = new N3.Parser({ format: 'N-Triples' });
        parser.parse(data, (error, quad, prefixes) => {
          const factory = new DataFactory();
          const store = new N3.Store();
          store.addQuad(quad); // .addQuads

          // TOPIC COLLECTION
          const topicCollection = 'http://www.example.com/topicCollection_1';
          const searchTopicCollection = store.getQuads(
            factory.namedNode(topicCollection)
          );
          for (const quad of searchTopicCollection) {
            // console.log(quad);
            let predicate = quad.predicate.value;
            if (
              quad.subject.value === topicCollection &&
              predicate.includes('rdf:_')
            ) {
              let object = quad.object.value;
              // let topic = object.replace('http://www.example.com/', '');
              topicArray[object] = { title: '', body: '', named_entities: [] }; // TOPIC ARRAY DIVENTA OGGETTO CHE POI VIENE PUSHATO A TOPIC ARRAY_2
              // topicArray.push({
              //   [object]: { title: '', body: '', named_entities: [] },
              // });
            }
          }

          // TOPIC TITLE
          for (let element in topicArray) {
            let topic = topicArray[element];
            let id = element;
            const searchTopicTitle = store.getQuads(factory.namedNode(id));
            for (const quad of searchTopicTitle) {
              if (
                quad.subject.value === id &&
                quad.predicate.value ===
                  'http://erlangen-crm.org/140617/P102_has_title'
              ) {
                let object = quad.object.value;
                topic.title = object;
                // console.log(topicArray);
              }
            }
          }

          // TOPIC BODY
          for (let element in topicArray) {
            let topic = topicArray[element];
            let id = element;
            const searchTopicBody = store.getQuads(factory.namedNode(id));
            for (const quad of searchTopicBody) {
              if (
                quad.subject.value === id &&
                quad.predicate.value ===
                  'http://erlangen-crm.org/140617/P3_has_note'
              ) {
                let object = quad.object.value;
                topic.body = object;
                // console.log(topicArray);
              }
            }
          }

          // TOPIC NAMED ENTITIES
          for (let element in topicArray) {
            let topic = topicArray[element];
            let id = element;
            const searchTopicNamedEntities = store.getQuads(
              factory.namedNode(id)
            );
            for (const quad of searchTopicNamedEntities) {
              if (
                quad.subject.value === id &&
                quad.predicate.value === 'ex:hasNamedEntity'
              ) {
                let object = quad.object.value;
                topic.named_entities.push(object);
                // console.log(topicArray);
              }
            }
          }

          // ENTITY TYPE
          for (let element in topicArray) {
            let topic = topicArray[element];
            let id = element;
            for (let entity of topic.named_entities) {
              // let key = Object.keys(entity)[0];
              // let label = entity[key].label;
              let label = entity;
              const searchTopicNamedEntities = store.getQuads(
                factory.namedNode(entity)
              );
              for (const quad of searchTopicNamedEntities) {
                if (
                  quad.subject.value === entity &&
                  quad.predicate.value === 'rdf:type'
                ) {
                  let object = quad.object.value;
                  let type = object
                    .replace('http://www.example.com/', '')
                    .toLowerCase();
                  topic.named_entities.push({
                    [type]: { label: '', url: '', rdf_value: entity },
                  });
                  let index = topic.named_entities.indexOf(label);
                  topic.named_entities.splice(index, 1);
                }
              }
            }
          }
        });
      });
    this.topicArray_2.push(topicArray);
  }

  createDataModel() {
    fetch('../../assets/tei-ref/de-rerum-natura.nt')
      .then((response) => response.text())
      .then((data) => {
        const parser = new N3.Parser({ format: 'N-Triples' });
        parser.parse(data, (error, quad, prefixes) => {
          const factory = new DataFactory();
          const store = new N3.Store();
          store.addQuad(quad); // .addQuads

          //ENTITY
          for (let element of this.topicArray_2) {
            for (let key in element) {
              let topic = element[key];
              let body = topic.body;
              const searchTopicBodyValue = store.getQuads(
                factory.namedNode(body)
              );
              for (const quad of searchTopicBodyValue) {
                if (
                  quad.subject.value === body &&
                  quad.predicate.value === 'rdf:value'
                ) {
                  let object = quad.object.value;
                  topic.body = object;
                }
              }
            }
          }

          //LABEL
          for (let element of this.topicArray_2) {
            for (let key in element) {
              let topic = element[key];
              let title = topic.title;
              const searchTopicTitleValue = store.getQuads(
                factory.namedNode(title)
              );
              for (const quad of searchTopicTitleValue) {
                if (
                  quad.subject.value === title &&
                  quad.predicate.value === 'rdfs:label'
                ) {
                  let object = quad.object.value;
                  topic.title = object;
                }
              }
            }
          }

          //NAMED ENTITIES
          for (let element of this.topicArray_2) {
            for (let key in element) {
              let topic = element[key];
              let entities = topic.named_entities;
              entities.map((entity) => {
              if (typeof entity !== 'string') {
                let type = Object.keys(entity)[0];
                let label = entity[type].rdf_value;
                // console.log(typeof(entity[type].rdf_value));
                // if (label === 'http://www.example.com/Rasputin') {
                //   console.log('check');
                // }
                let searchEntityLabel = store.getQuads(
                  factory.namedNode(label)
                );
                for (let quad of searchEntityLabel) {
                  if (
                    quad.subject.value === label &&
                    quad.predicate.value === 'rdfs:label'
                  ) {
                    let object = quad.object.value;
                    entity[type].label = object;
                    // console.log(topicArray);
                  }
                }
                for (let quad of searchEntityLabel) {
                  if (
                    quad.subject.value === label &&
                    quad.predicate.value === 'rdfs:seeAlso' //FIXME rdfs:seeAlso
                  ) {
                    let object = quad.object.value;
                    entity[type].url = object;
                    // console.log(topicArray);
                  }
                }
              }
            });
          }};

          //BUTTONS
          for (let element of this.topicArray_2) {
            for (let topic in element) {
              // console.log(element[topic].title);
              // let prova = 'http://www.prova.com'
              // if (prova.includes('http://')) {
              //   console.log('true');
              // }
              this.buttonArray.push({ id: topic, label: element[topic].title });
            }
          }
        });
      });
  }

  createButtons(array) {
    // console.log(array);
    // for (let element of array) {
    //  console.log(element);
    // //  element.map(prova => console.log(prova));
     
    // }
    array.map((element) => {
      for (let topic in element) {
        this.buttonArray.push({ id: topic, label: element[topic].title });
      }
    });
  }

  parseTopic(chosenTopic) {
    this.topicArray.map((element) => {
      for (let topic in element) {
        let title = element[topic].title;
        let body = element[topic].body;
        let display = element[topic].isDisplayed;
        let selectContainer = document.querySelector('.topic-container');
        let selectSide = document.querySelector('.sidebar');
        if (topic === chosenTopic) {
          selectContainer.innerHTML = `<div>
            <h2 class='topic-title'>${title}</h2>
            <div class='topic-body'>${body}</div>
          </div>`;
        }
        let peopleArray = [];
        let itemsArray = [];
        if (element[topic].named_entities) {
          element[topic].named_entities.map((entity) => {
            for (let type in entity) {
              if (type === 'person') {
                peopleArray.push(entity[type]);
              }
              if (type === 'item') {
                itemsArray.push(entity[type]);
              }
            }
          });
          // for (let entity of element[topic].named_entities) {
          //   for (let field of entity);
          //   console.log(entity);
          // }
        }
        if (topic === chosenTopic) {
          document.querySelector('.sidebar').innerHTML = '';
          if (peopleArray) {
            let divSide = document.createElement('div');
            divSide.className = 'people';
            divSide.innerHTML = '<h4>People</h4>';
            selectSide.appendChild(divSide);
            let ulSide = document.createElement('ul');
            divSide.appendChild(ulSide);
            for (let entity of peopleArray) {
              let liSide = document.createElement('li');
              liSide.innerHTML = `<li><a href='${entity.url}'>${entity.label}</a></li>`;
              ulSide.appendChild(liSide);
            }
          }
          if (itemsArray) {
            let divSide = document.createElement('div');
            divSide.className = 'items';
            divSide.innerHTML = '<h4>Items</h4>';
            selectSide.appendChild(divSide);
            let ulSide = document.createElement('ul');
            divSide.appendChild(ulSide);
            for (let entity of itemsArray) {
              let liSide = document.createElement('li');
              liSide.innerHTML = `<li><a href='${entity.url}'>${entity.label}</a></li>`;
              ulSide.appendChild(liSide);
            }
          }
        }
      }
    });
  }

  buildTimeline(arr) {
    const searchValue = (item) => {
      for (let field of item) {
        return field['@value'] || field['o:label'];
      }
    };

    arr.forEach((item) => {
      const timeline_item = {
        media: {
          url: item.video_source
            ? item.video_source
            : item.thumbnail_display_urls.large, // FIXME: undefined
          credit: searchValue(item['dcterms:creator']),
        },
        start_date: {
          year: searchValue(item['dcterms:date']),
        },
        text: {
          headline: `<a
                href="work/${item['o:id']}/timeline">${item['o:title']}</a>`,
          text: item['dcterms:description']
            ? '<p>' + searchValue(item['dcterms:description']) + '</p>'
            : null,
        },
      };
      this.timeline_json.events.push(timeline_item);
    });
  }

  slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w\-]+/g, '') // Remove all non-word chars
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
