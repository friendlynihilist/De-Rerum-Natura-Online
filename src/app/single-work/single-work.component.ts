import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as N3 from 'n3';
import { namedNode } from 'n3/src/N3DataFactory';
import { DataFactory } from 'rdf-data-factory';

import { WorkService } from '../work/work.service';
import { Work } from '../work/work';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-work',
  templateUrl: './single-work.component.html',
  styleUrls: ['./single-work.component.scss']
})
export class SingleWorkComponent implements OnInit {
  item: { id: number; title: string };
  paramsSubscription: Subscription;

  work:Work;
  id;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workService: WorkService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  loadedItem;

  trustedDashboardUrl: SafeUrl;

  fetchItem() {
    //private?
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
        item.map(i => {
          if (i['o:id'] === +this.id) {
            this.loadedItem = this.parseRDF(this.parseMedia(i));
          }
        })
        // console.log(this.parseRDF(this.parseMedia(this.loadedItem)));
      });
  }

  getId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}
  
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
          const uri = item["@id"];
          const searchQuad = store.getQuads(
            factory.namedNode(uri)
          );
          for (const quad of searchQuad) {
            if(quad.subject.value === uri)
            {
              item.ref_count++
            }
          }
        });
      });
      return item;
  }

  parseMedia(item) {
    let mediaUrl = item["o:media"].map((field) => field["@id"]);
    
    fetch(mediaUrl)
    .then((response) => response.json())
    .then((data) => { 
      if (data["o:original_url"]) {
        item.original_url = data["o:original_url"];
      }
      else {
        const stripUrl = this.getId(data["o:source"]);
        item.video_source = 'https://www.youtube.com/embed/' + stripUrl;
      }
    });
    return item;
  }

  sub;

  ngOnInit(): void {
    this.sub=this.route.paramMap.subscribe(params => {
      console.log(params);
      this.id = params.get('id');
      let works=this.workService.getWorks();
      this.work=works.find(p => p.id==this.id);
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
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.sub.unsubscribe();
  }

  isValid(string) {
    if (/dcterms/.test(string)) {
      return true;
      }
    else return false;
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

    buildLink(obj) {
      let baseUrl="http://localhost:4200"
      return `${baseUrl}/work/${obj['value_resource_id']}/${this.slugify(obj['display_title'])}`
    }

  // OnBack(): void {this.router.navigate(['work']);} //per implementare un back button, poi servirà a button (click)="onBack()" nell'html
}
