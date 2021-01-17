import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { WorkService } from '../work/work.service';
import { Work } from '../work/work';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { parser } from '../parsers';

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
    private workService: WorkService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  loadedItem;

  trustedDashboardUrl: SafeUrl;

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
        item.map(i => {
          if (i['o:id'] === +this.id) {
            this.loadedItem = parser.parseRDF(parser.parseMedia(i));
          }
        })
      });
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

    buildLink(obj) {
      let baseUrl="http://localhost:4200"
      return `${baseUrl}/work/${obj['value_resource_id']}/${parser.slugify(obj['display_title'])}`
    }
}
