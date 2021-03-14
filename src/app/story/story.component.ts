import { Component, OnInit, Renderer2 } from '@angular/core';
import * as N3 from 'n3';
import { DataFactory } from 'rdf-data-factory';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parser } from '../parsers';
import { TL, Timeline } from '@knight-lab/timelinejs/src/js/index';
// import * as Tocbot from 'tocbot';

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
        ]
      },
      "http://www.example.com/topic_2": {
        "title": "Enrico Baj, De rerum natura (1958)",
        "body": "<p>Nell’aprile del 1958 <a href='http://viaf.org/viaf/54154160'>Arturo Schwarz</a> pubblica <i>De rerum natura</i>, una cartella, stampata in 51 esemplari, che raccoglie 36 acqueforti di <a href='https://viaf.org/viaf/6887/'>Enrico Baj</a>. A questo progetto Baj iniziò a lavorare già nel 1952, cioè lo stesso anno in cui lanciava, assieme a <a href='https://viaf.org/viaf/90380241/'>Sergio Dangelo</a>, il primo manifesto del Movimento Nucleare. Tra il 1952 e il 1953 Baj incide circa sessanta lastre, sperimentando cosi una tecnica che lo costringe a misurarsi con un tratto sottile, continuo e nitido; sceglie poi di riorganizzare il materiale in maniera autonoma rispetto al testo di Lucrezio selezionando 36 incisioni, che vengono a formare tre sezioni di dodici elementi l’una: le storie del sole (1-12), della vita (13-24) e della morte (25-36). «Sotto l’occhio vigile del sole, il primitivo disordine informale gradatamente perviene a organizzarsi, fino all’emergere delle presenze umane, sino alla storia dei rapporti tra uomo e donna, ai suoi giochi sociali (la musica, la danza, la toeletta) e alle sue tragedie (la guerra, la pestilenza, la morte), per narrare infine il disfacimento del tutto e il suo ciclico restituirsi al caos originario» (Arturo Schwarz).</p>",
        "named_entities": [
          {
            "person": {
              "label": "Enrico Baj",
              "url": "https://viaf.org/viaf/6887/",
              "rdf_value": "http://www.example.com/Enrico_Baj"
            }
          },
          {
            "person": {
              "label": "Sergio Dangelo",
              "url": "https://viaf.org/viaf/90380241/",
              "rdf_value": "http://www.example.com/Sergio_Dangelo"
            }
          },
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
        "title": "Enrico Baj, De rerum natura (1958) - Le storie della morte",
        "body": "<p>La terza sezione, che rappresenta le storie della morte, si apre con un dittico che sembra rievocare due passi contigui che si incontrano nel proemio del I libro del <i>De rerum natura</i>: <i>L’uomo che lotta col drago</i> (25) sembra infatti rimandare alla lotta di Epicuro contro la mostruosa <i>religio</i> evocata nel primo elogio del filosofo (Lucr. 1, 63-79), mentre l’acquaforte successiva (26) rappresenta il sacrificio di Ifianassa, descritto in Lucr. 1, 80-101 quale exemplum dei terribili delitti compiuti in nome della religio (Lucr. 1,101 <i>tantum religio potuit suadere malorum</i>). Le restanti incisioni, aperte dall’inquietante <i>Insetto</i>(27), illustrano allora guerra (28 <i>Battaglia</i>) e morte, una morte che giunge sotto forma di una pestilenza che consuma progressivamente i corpi, disgregandoli in informi spirali atomiche (29-34): quelle stesse spirali atomiche che nelle storie del sole rappresentavano l’origine delle cose, il passaggio dal caos al cosmo, dall’informale alla forma. Baj sembra allora riproporre la struttura ciclica del poema lucreziano, che si chiude con la peste di Atene per poi riaprirsi, di nuovo, col proemiale inno a Venere. Una ciclicità che sembra suggellata dal dittico finale, dove al volto deformato nell’urlo (<a href=’http://localhost:4200/work/21/donna-urlante’>35 <i>Donna urlante</i></a>) segue «la serena immagine del silenzio» (36) che ha l’aspetto di «una giovane e graziosa fanciulla, quasi presaga di un nuovo inizio dopo le rovine» (Martina Corgnati).</p>",
        "named_entities": [
          {
            "person": {
              "label": "Enrico Baj",
              "url": "https://viaf.org/viaf/6887/",
              "rdf_value": "http://www.example.com/Enrico_Baj"
            }
          },
          {
            "item": {
              "label": "Donna Urlante",
              "url": "http://localhost:4200/work/21/donna-urlante",
              "rdf_value": "http://www.example.com/Donna_Urlante"
            }
          }
        ]
      },
      "http://www.example.com/topic_4": {
        "title": "Jean Chièze, Lucrèce. De natura rerum (1958) ",
        "body": "<p>Nel 1958 l’<i>Union Latine d’Editions</i> pubblica la traduzione francese del De rerum natura di Mauro Meunier accompagnata da 19 incisioni di <a href='https://viaf.org/viaf/7388391/'>Jean Chièze</a>. L’ultima di queste xilografie raffigura una scena ispirata alla peste d’Atene di Lucrezio, in particolare ai vv. 1272-1275, dove sono descritti i cadaveri degli appestati stipati all’interno dei templi. L’ispirazione lucreziana risulta però contaminata con la memoria iconografica, dal momento che l’associazione tra cadaveri e templi è ben presente in varie rappresentazioni di antiche pestilenze, come nella Peste di Azoth di <a href='https://viaf.org/viaf/24606800/'>Nicolas Poussin</a> (1631): <img src='../../assets/img/Nicolas_Poussin_-_La_Peste_à_Ashdod.jpg' width='90%' style='display:block;margin-left:auto;margin-right:auto;padding:20px'/> o nella Peste in una città antica del pittore fiammingo <a href=’ https://viaf.org/viaf/24606800/’>Michiel Sweerts</a>  (1652/1654): <img src='../../assets/img/plagueofathens.jpg' width='90%' style='display:block;margin-left:auto;margin-right:auto;padding:20px'> Se esaminata alla luce di questi modelli la soluzione proposta da Chièze, che rappresenta i cadaveri riversi lungo la scalinata del tempio, risulta più patetica e più in linea con il pensiero filosofico di Lucrezio: è come se questi uomini morissero mentre cercano invano un ultimo, disperato, aiuto degli dèi.</p>",
        "named_entities": [
          {
            "person": {
              "label": "Jean Chièze",
              "url": "https://viaf.org/viaf/7388391/",
              "rdf_value": "http://www.example.com/Jean_Chièze"
            }
          },
          {
            "person": {
              "label": "Nicolas Poussin",
              "url": "https://viaf.org/viaf/24606800/",
              "rdf_value": "http://www.example.com/Jean_Chièze"
            }
          },
          {
            "person": {
              "label": "Michiel Sweerts",
              "url": "https://viaf.org/viaf/24606800/",
              "rdf_value": "http://www.example.com/Jean_Chièze"
            }
          }
        ]
      },
      "http://www.example.com/topic_5": {
        "title": "Teresa Procaccini, Op. 17: La peste d’Atene (1958)",
        "body": "<p>Nello stesso anno in cui <a href=’#’>Baj</a> e <a href=’#’>Chièze</a> pubblicano i loro lavori lucreziani, <a href=’#’>Teresa Procaccini</a> licenzia <a href=’#’>La peste d’Atene</a>, cantata per coro e orchestra ispirata al finale del <i>De rerum natura</i>, di cui vengono selezionate le sezioni più dense di pathos: Lucr. 1,1138-1146 (l’inizio dell’epidemia e i primi sintomi del male); 1158-1159 (al dolore fisico si unisce un senso d’angoscia); 1216-1224 (la morte non risparmia nemmeno gli animali); 1230-1234 (il pensiero della morte affligge gli appestati); 1252-1258 (i corpi ammassati dei malati, i famigliari che muoiono gli uni sugli altri). Può essere interessante il confronto con la selezione che farà, trent’anni più tardi <a href=’#’>Edoardo Sanguineti</a>, chiamato dal compositore <a href=’#’>Luca Lombardi</a> a realizzare un’«anti-antologia» lucreziana divisa in tre sezioni (Natura, Amore, Morte), che costituiranno le tre parte di <i>Oratorio materialistico</i>: per la terza sezione – l’unica non ancora musicata da Lombardi – Sanguineti sceglierà infatti brani molto espressivi e violenti, indugiando soprattutto sui sintomi della peste (Lucr. 6,1138-1144; 1197-1214; 1263-1281). Dal punto di vista musicale la cantata di <a href=’#’>Teresa Procaccini</a> offre un vasto affresco sinfonico-corale, le cui sezioni, ben distinte e caratterizzate, si susseguono senza soluzione di continuità. La scrittura corale – un declamato omoritmico che suggerisce un’atmosfera sonora arcaica – inserisce la cantata nell’alveo della corrente neoclassica, basata sul recupero di stilemi musicali anticheggianti o sull’impiego di riferimenti al mondo latino e greco. L’opera si caratterizza per l’impiego di una scrittura orchestrale moderno-espressionista: rispetto al declamato arcaizzante e misurato del coro, la parte strumentale tende a rendere l’atmosfera cupa e spettrale dei versi con timbri scuri e colori accesi. La suddivisione in sezioni ben distinte, la scrittura orchestrale tesa a valorizzare il clima espressivo dei versi, e, in generale, il rapporto descrittivo-imitativo che la musica instaura con il contenuto poetico, conferiscono alla <i>Peste d’Atene</i> una qualità cinematografica.</p>",
        "named_entities": [
          {
            "person": {
              "label": "Enrico Baj",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          },
          {
            "person": {
              "label": "Jeanne Chièze",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          },
          {
            "person": {
              "label": "Luca Lombardi",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          },
          {
            "person": {
              "label": "Teresa Procaccini",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          },
          {
            "person": {
              "label": "Edoardo Sanguineti",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          },
          {
            "item": {
              "label": "Op. 17: La peste d'Atene",
              "url": "http://viaf.org/viaf/54154160",
              "rdf_value": "http://www.example.com/Excalibur"
            }
          },
        ]
      },
      // "http://www.example.com/topic_6": {
      //   "title": "Sesto",
      //   "body": "<p>Questo è il sesto topic</p>",
      //   "named_entities": [
      //     {
      //       "person": {
      //         "label": "Enrico Baj",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     },
      //     {
      //       "person": {
      //         "label": "La peste d'Atene",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     },
      //     {
      //       "person": {
      //         "label": "La peste d'Atene",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     },
      //     {
      //       "person": {
      //         "label": "La peste d'Atene",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     },
      //     {
      //       "item": {
      //         "label": "Op. 17: La peste d'Atene",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     },
      //   ]
      // },
      // "http://www.example.com/topic_7": {
      //   "title": "Settimo",
      //   "body": "<p>Questo è il settimo topic</p>",
      //   "named_entities": [
      //     {
      //       "item": {
      //         "label": "Excalibur",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     }
      //   ]
      // },
      // "http://www.example.com/topic_8": {
      //   "title": "Ottavo",
      //   "body": "<p>Questo è il ottavo topic</p>",
      //   "named_entities": [
      //     {
      //       "item": {
      //         "label": "Excalibur",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     }
      //   ]
      // },
      // "http://www.example.com/topic_9": {
      //   "title": "Nono",
      //   "body": "<p>Questo è il nono topic</p>",
      //   "named_entities": [
      //     {
      //       "item": {
      //         "label": "Excalibur",
      //         "url": "http://viaf.org/viaf/54154160",
      //         "rdf_value": "http://www.example.com/Excalibur"
      //       }
      //     }
      //   ]
      // }
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
        }
        if (topic === chosenTopic) {
          document.querySelector('.sidebar').innerHTML = '';
          if (peopleArray.length > 0) {
            let divSide = document.createElement('div');
            // divSide.style.border = '1px solid rgba(0, 0, 0, 0.39)';
            // divSide.style.padding = '1rem';
            divSide.className = 'people';
            let titleSide = document.createElement('h4');
            titleSide.innerHTML = 'People';
            titleSide.style.borderBottom = '1px solid rgba(0, 0, 0, 0.39)';
            titleSide.style.padding = '0.6rem';
            divSide.appendChild(titleSide); 
            selectSide.appendChild(divSide);
            let ulSide = document.createElement('ul');
            ulSide.style.listStyleType = 'none';
            divSide.appendChild(ulSide);
            for (let entity of peopleArray) {
              let liSide = document.createElement('li');
              liSide.innerHTML = `<li><a href='${entity.url}'>${entity.label}</a></li>`;
              ulSide.appendChild(liSide);
            }
          }
          if (itemsArray.length > 0) {
            let divSide = document.createElement('div');
            let titleSide = document.createElement('h4');
            titleSide.innerHTML = 'Items';
            titleSide.style.borderBottom = '1px solid rgba(0, 0, 0, 0.39)';
            titleSide.style.padding = '0.6rem';
            divSide.appendChild(titleSide); 
            divSide.className = 'items';
            
            selectSide.appendChild(divSide);
            let ulSide = document.createElement('ul');
            ulSide.style.listStyleType = 'none';
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
