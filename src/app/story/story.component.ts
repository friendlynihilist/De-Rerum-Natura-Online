import { Component, OnInit, Renderer2 } from '@angular/core';
import * as N3 from 'n3';
import { DataFactory } from 'rdf-data-factory';
import { HttpClient } from '@angular/common/http';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { map } from 'rxjs/operators';
import { parser } from '../parsers';
import { TL, Timeline } from '@knight-lab/timelinejs/src/js/index';
import { bootstrap } from 'bootstrap';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  providers: [NgbCarouselConfig],
})
export class StoryComponent implements OnInit {
  images = [
    '../../assets/img/baj_1.JPG',
    '../../assets/img/baj_2.JPG',
    '../../assets/img/sieni_1.JPG',
  ];

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    config: NgbCarouselConfig
  ) {
    config.interval = 20000;
    config.keyboard = true;
    config.animation = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    this.fetchItems();
    this.fetchInteractiveResources();
    // this.createButtons(this.topicArray);
    // this.isActive();
    // this.parseTopic('http://www.example.com/topic_2');
    // console.log(this.timeline_json);
    // console.log(this.topicArray);
    // console.log(this.topicArray_2);
  }

  topicArray = [
    {
      'http://www.example.com/topic_2': {
        title: 'Le acqueforti di Baj',
        body: "<p>Nell’aprile del 1958 <a href='http://viaf.org/viaf/54154160'>Arturo Schwarz</a> <i class='fas fa-external-link-alt'></i> pubblica <i>De rerum natura</i>, una cartella, stampata in 51 esemplari, che raccoglie 36 acqueforti di <a href='https://viaf.org/viaf/6887/'>Enrico Baj</a> <i class='fas fa-external-link-alt'></i>. A questo progetto Baj iniziò a lavorare già nel 1952, cioè lo stesso anno in cui lanciava, assieme a <a href='https://viaf.org/viaf/90380241/'>Sergio Dangelo</a> <i class='fas fa-external-link-alt'></i>, il primo manifesto del Movimento Nucleare. Tra il 1952 e il 1953 Baj incide circa sessanta lastre, sperimentando cosi una tecnica che lo costringe a misurarsi con un tratto sottile, continuo e nitido; sceglie poi di riorganizzare il materiale in maniera autonoma rispetto al testo di Lucrezio selezionando 36 incisioni, che vengono a formare tre sezioni di dodici elementi l’una: le storie del sole (1-12), della vita (13-24) e della morte (25-36). «Sotto l’occhio vigile del sole, il primitivo disordine informale gradatamente perviene a organizzarsi, fino all’emergere delle presenze umane, sino alla storia dei rapporti tra uomo e donna, ai suoi giochi sociali (la musica, la danza, la toeletta) e alle sue tragedie (la guerra, la pestilenza, la morte), per narrare infine il disfacimento del tutto e il suo ciclico restituirsi al caos originario» (Arturo Schwarz).</p>",
        href: 'donne-nude',
        named_entities: [
          {
            person: {
              label: 'Enrico Baj',
              url: 'https://viaf.org/viaf/6887/',
              rdf_value: 'http://www.example.com/Enrico_Baj',
            },
          },
          {
            person: {
              label: 'Sergio Dangelo',
              url: 'https://viaf.org/viaf/90380241/',
              rdf_value: 'http://www.example.com/Sergio_Dangelo',
            },
          },
          {
            person: {
              label: 'Arturo Schwarz',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Arturo_Schwarz',
            },
          },
        ],
      },
      'http://www.example.com/topic_3': {
        title: 'Le storie della morte',
        body: "<p>La terza sezione, che rappresenta le storie della morte, si apre con un dittico che sembra rievocare due passi contigui che si incontrano nel proemio del I libro del <i>De rerum natura</i>: <i>L’uomo che lotta col drago</i> (25) sembra infatti rimandare alla lotta di Epicuro contro la mostruosa <i>religio</i> evocata nel primo elogio del filosofo (Lucr. 1, 63-79), mentre l’acquaforte successiva (26) rappresenta il sacrificio di Ifianassa, descritto in Lucr. 1, 80-101 quale exemplum dei terribili delitti compiuti in nome della religio (Lucr. 1,101 <i>tantum religio potuit suadere malorum</i>). Le restanti incisioni, aperte dall’inquietante <i>Insetto</i>(27), illustrano allora guerra (28 <i>Battaglia</i>) e morte, una morte che giunge sotto forma di una pestilenza che consuma progressivamente i corpi, disgregandoli in informi spirali atomiche (29-34): quelle stesse spirali atomiche che nelle storie del sole rappresentavano l’origine delle cose, il passaggio dal caos al cosmo, dall’informale alla forma. Baj sembra allora riproporre la struttura ciclica del poema lucreziano, che si chiude con la peste di Atene per poi riaprirsi, di nuovo, col proemiale inno a Venere. Una ciclicità che sembra suggellata dal dittico finale, dove al volto deformato nell’urlo (<a href=’http://localhost:4200/work/21/donna-urlante’>35 <i>Donna urlante</i></a> <i class='fas fa-cubes'></i>) segue «la serena immagine del silenzio» (36) che ha l’aspetto di «una giovane e graziosa fanciulla, quasi presaga di un nuovo inizio dopo le rovine» (Martina Corgnati).</p>",
        href: 'donna-urlante',
        named_entities: [
          {
            person: {
              label: 'Enrico Baj',
              url: 'https://viaf.org/viaf/6887/',
              rdf_value: 'http://www.example.com/Enrico_Baj',
            },
          },
          {
            item: {
              label: 'Donna Urlante',
              url: 'http://localhost:4200/work/21/donna-urlante',
              rdf_value: 'http://www.example.com/Donna_Urlante',
            },
          },
        ],
      },
      'http://www.example.com/topic_5': {
        title: 'Natura decomposta',
        body: '<p>Il cortometraggio di <a style=’text-decoration:none’ href=’#’>Vittorio Armentano</a>, prodotto nel 1964 da Vette FilmItalia, offre un approccio fortemente sperimentale, che si presenta come un montaggio serrato di immagini statiche e brevi sequenze, accompagnate dalle musiche di <a style=’text-decoration:none’ href=’#’>Egisto Macchi</a> e da una voce fuoricampo che recita passi tratti dalla peste d’Atene di Lucrezio intervallati da frammenti dei Cantos di <a style=’text-decoration:none’  href=’#’>Ezra Pound</a>. Il filmato si apre con la traduzione italiana di Lucr. 1131-1134, cioè dei versi che introducono l’excursus dedicato alla peste d’Atene: il contagio colpisce indistintamente uomini e animali, che vengono così associati nello stesso tragico destino. Il filmato sia apre allora con scene cruente, girate all’interno del mattatoio di Roma; a partire dal 3’ le immagini degli animali abbattuti vengono montate assieme a brevi spezzoni che mostrano macchine industriali in rapido movimento, che quasi eclissano con la loro presenza il ruolo degli operai che le manovrano. In 3.45’’ viene recitato dalla voce fuori campo un altro passo del De rerum natura: si tratta dei vv. 1259-1271 che accompagnano ancora una volta immagini girate al mattatoio, ma che in un certo senso anticipano la sequenza successiva, in cui all’uccisione dei bovini si mescolano immagini di torture e esecuzioni perpetrate contro esseri umani. Questa sequenza, piuttosto violenta, si chiude solo in 6.54’’, quando in maniera improvvisa le immagini convulse lasciano il posto alle riprese di una ragazza che cammina in un giorno d’inverno lungo una spiaggia deserta: la voce fuoricampo recita ora diversi passi tratti dai Cantos di Pound, l’ultimo dei quali sembra suggerire la chiave di lettura dell’intero cortometraggio: «questi frammenti hai del naufragio».</p>',
        href: 'natura-decomposta',
        named_entities: [
          {
            person: {
              label: 'Vittorio Armentano',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
          {
            person: {
              label: 'Egisto Macchi',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
          {
            person: {
              label: 'Ezra Pound',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
          {
            item: {
              label: 'Natura decomposta',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
        ],
      },
      'http://www.example.com/topic_6': {
        title: 'Oro',
        body: '<p>La riflessione sulle età dell’uomo alla luce dell’atomismo lucreziano affrontata in <a style=’text-decoration:none’  href=’#’>La natura delle cose</a> (2008) trova il suo naturale sviluppo in <a style=’text-decoration:none’  href=’#’>Oro</a> (2009). In questo spettacolo il tema è indagato attraverso la giustapposizione, o meglio la concatenazione di elementi contrastanti; le coreografie sono infatti danzate da professionisti assieme a non professionisti, soluzione che permette di ricreare sul palcoscenico una concordia oppositorum in cui si mescolano uomini e donne, adolescenti e vecchi, bambini e adulti, persone in grado di vedere e non vedenti. Questa processione di corpi, in cui «le figure procedono fisicamente unite in un viaggio immerso nella lentezza lungo il bordo della vita», culmina nella scena finale – ispirata alla peste d’Atene di Lucrezio – in cui viene rappresentata la morte di cinque gemelli: cinque danzatori, resi indistinguibili dall’identica maschera di bamboccio macrocefalo (la stessa già usata in La natura delle cose, e ispirata alle acqueforti di <a style=’text-decoration:none’  href=’#’>Baj</a>), formano «un unico corpo che si sostiene dall’interno, un corpo capace di osservarsi, di moltiplicare lo sguardo e il tatto» (Virgilio Sieni).</p>',
        href: 'oro',
        named_entities: [
          {
            person: {
              label: 'Enrico Baj',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
          {
            item: {
              label: 'La natura delle cose',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
          {
            item: {
              label: 'Oro',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
        ],
      },
      'http://www.example.com/topic_7': {
        title: "L'ultimo giorno per noi",
        body: '<p>La sequenza finale di <a style=’text-decoration:none’ href=’#’>Oro</a> viene poi ripresa e sviluppata in <a style=’text-decoration:none’ href=’#’>L’ultimo giorno per noi</a> (2010), atto conclusivo della trilogia ispirata al De rerum natura. Lo spunto lucreziano e rappresentato, anche in questo caso, dalla peste d’Atene e in particolare dai vv. 1256-1258: «Sui bambini esanimi si vedevano talvolta i corpi inanimati dei genitori, e all’opposto talora sulle madri e sui padri i figli esalare la vita» (passo che concludeva anche la cantata di <a style=’text-decoration:none’  href=’#’>Teresa Procaccini</a>, segnando il culmine del pathos). All’immagine lucreziana si sovrappone pero l’eco di due drammatici fatti di cronaca, l’uno contemporaneo, l’altro risalente a piu di un decennio prima: la tragedia del ‘gommone di Malta’, in cui cinque migranti – gli unici superstiti di un barcone della speranza partito dall’Africa – vennero respinti in mare senza soccorso, abbandonati a una deriva disumana; e l’immagine straziante della ‘Madonna di Benthala’, diventata icona del massacro compiuto il 23 settembre 1997 da un gruppo di terroristi islamici in un villaggio dell’Algeria. Il testo di Lucrezio entra cosi in relazione con i drammi della storia e prende forma nei corpi di cinque fratelli gemelli «fatti d’atomi e vuoto, di amaro e dolore» che danzando vanno incontro alla morte: per Sieni queste «figure lucreziane che si nutrono di declinazioni e sospensioni fisiche» realizzano allora «una coreografia sul sostenersi e sulla ciclicità del gesto che si rigenera nella fisica e nell’etica, nell’emozione e nell’incessante ora del desiderio. Un desiderio che crea tenuità e incanto, che scioglie il corpo nella dinamica, che reinventa una sintassi della fine» (Virgilio Sieni).</p>',
        href: 'lultimo-giorno-per-noi',
        named_entities: [
          {
            item: {
              label: 'Oro',
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
          {
            item: {
              label: "L'ultimo giorno per noi",
              url: 'http://viaf.org/viaf/54154160',
              rdf_value: 'http://www.example.com/Excalibur',
            },
          },
        ],
      },
    },
  ];
  topicArray_2 = [];

  buttonArray = [];

  loadedItems = [];

  timeline_json = {
    events: [],
  };
  options = {
    debug: true,
    hash_bookmark: true,
  };

  // carousel = false;
  // timeline = true;

  switchBetweenView(id) {
    let timeline = document.querySelector('.timeline');
    let carousel = document.querySelector('.carousel');
    if (id === 'carousel') {
      timeline.className += ' hidden';
      carousel.className = 'carousel';
    }
    if (id === 'timeline') {
      carousel.className += ' hidden';
      timeline.className = 'timeline';
    }
  }

  truncate(text, max) {
    return text.substr(0, max - 1) + (text.length > max ? ' ...' : '');
  }

  isActive() {
    var btnContainer = document.getElementById('toc');
    let btns = btnContainer.getElementsByClassName('topic');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        var current = document.getElementsByClassName('active');
        current[0].className = current[0].className.replace(' active', '');
        this.className += ' active';
      });
    }
    // document.getElementById(selectedTopic).className += ' active-filter';
  }

  timeline;

  goToEvent(id) {
    this.timeline.goToId(id);
  }

  fetchItems() {
    this.http
      .get('http://137.204.168.14/lib/api/items')
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
        // console.log(this.timeline_json);
        this.timeline = new Timeline(
          'timeline-embed',
          this.timeline_json,
          this.options
        );
      });
  }

  loadedStories = [];

  fetchInteractiveResources() {
    this.http
      .get('http://137.204.168.14/lib/api/item_sets')
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
        items.map((item) => {
          if (item['@type'][1] == 'dctype:InteractiveResource') {
            this.loadedStories.push(item);
          }
        });
        // this.buildTimeline(this.loadedItems);
        console.log(this.loadedStories);
        // this.timeline = new Timeline('timeline-embed', this.timeline_json, this.options);
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
            }
          }

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
        this.buttonArray.push({
          id: topic,
          label: element[topic].title,
          href: element[topic].href,
        });
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
              liSide.innerHTML = `<li><i class="fas fa-user"> </i><a style="text-decoration:none" href='${entity.url}'> ${entity.label}</a></li>`;
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
              liSide.innerHTML = `<li><i class="fas fa-cubes"></i> <a style="text-decoration:none" href='${entity.url}'> ${entity.label}</a></li>`;
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
      if (
        item['o:title'] !== 'Untitled' &&
        item['o:title'] !== 'Casa di Lucrezio' &&
        item['o:title'] !== "La peste d'Athènes"
      ) {
        const timeline_item = {
          media: {
            url: item.video_source
              ? item.video_source
              : item.thumbnail_display_urls.large, // FIXME: undefined
            credit: searchValue(item['dcterms:creator']),
          },
          start_date: {
            year: searchValue(item['dcterms:date']).toString().includes('-')
              ? searchValue(item['dcterms:date']).toString().split('-')[0]
              : searchValue(item['dcterms:date']),
          },
          end_date: {
            year: searchValue(item['dcterms:date']).toString().includes('-')
              ? searchValue(item['dcterms:date']).toString().split('-')[1]
              : '',
          },
          // group:
          //   item['o:title'] === 'La morte' ||
          //   item['o:title'] === 'Silenzio' ||
          //   item['o:title'] === 'Mostro' ||
          //   item['o:title'] === 'Donna urlante' ||
          //   item['o:title'] === 'I bambini muoiono'
          //     ? 'Le storie della morte'
          //     : '',
          text: {
            headline: `<a
                href="work/${item['o:id']}/timeline">${item['o:title']}</a>`,
            text: item['dcterms:description']
              ? '<p>' + searchValue(item['dcterms:description']) + '</p>'
              : null,
          },
          unique_id: this.slugify(item['o:title']),
        };
        this.timeline_json.events.push(timeline_item);
      }
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
