import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { WorkService } from '../work/work.service';
import { Work } from '../work/work';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { parser } from '../parsers';
import { TextSelectorService } from '../text-selector.service';
import * as N3 from 'n3';
import { DataFactory } from 'rdf-data-factory';

@Component({
  selector: 'app-single-work',
  templateUrl: './single-work.component.html',
  styleUrls: ['./single-work.component.scss'],
})
export class SingleWorkComponent implements OnInit, OnDestroy {
  updatedClient;
  loadedItem;
  item: { id: number; title: string };
  paramsSubscription: Subscription;
  trustedDashboardUrl: SafeUrl;
  work: Work;
  id;
  sub;

  constructor(
    private textSelector: TextSelectorService,
    private route: ActivatedRoute,
    private router: Router,
    private workService: WorkService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

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
          // console.log(searchQuad);
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
              // item.has_xpath = quadE.object.value;
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
  }

  fetchItem() {
    this.http
      .get(`https://137.204.168.14/lib/api/items`)
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
      .subscribe((item) => {
        item.map((i) => {
          if (i['o:id'] === +this.id) {
            this.loadedItem = this.parseRDF(parser.parseMedia(i));
            this.updatedClient = this.loadedItem.has_xpath;
            this.textSelector.updatedCustomer(this.updatedClient);
          }
        });
        console.log(item);
      });
  }

  updateXPath() {
    this.updatedClient = this.loadedItem.has_xpath;
    this.textSelector.updatedCustomer(this.updatedClient);
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      console.log(params);
      this.id = params.get('id');
      let works = this.workService.getWorks();
      this.work = works.find((p) => p.id == this.id);
    });

    this.item = {
      id: this.route.snapshot.params['id'],
      title: this.route.snapshot.params['title'],
    };
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.item.id = params['id']; //+
      this.item.title = params['title'];
    });

    this.fetchItem();
    // console.log(this.loadedItem);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.sub.unsubscribe();
  }

  isValid(string) {
    if (/dcterms/.test(string)) {
      return true;
    } else return false;
  }

  buildLink(obj) {
    let baseUrl = 'http://localhost:4200';
    return `${baseUrl}/work/${obj['value_resource_id']}/${parser.slugify(
      obj['display_title']
    )}`;
  }
}
