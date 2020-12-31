import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { WorkService } from '../work/work.service';
import { Work } from '../work/work';

@Component({
  selector: 'app-single-work',
  templateUrl: './single-work.component.html',
  styleUrls: ['./single-work.component.scss'],
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
    private http: HttpClient
  ) {}

  loadedItem;

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
        //...
        // this.loadeditem = this.builditem(item);
        // let rawOverview = JSON.parse(JSON.stringify(item));
        // console.log(this.builditem(item));
        // console.log(this.renderData(this.builditem(item)));
        item.map(i => {
          if (i['o:id'] === +this.id) {
            this.loadedItem = i;
          }
        })
        console.log(this.loadedItem);
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
