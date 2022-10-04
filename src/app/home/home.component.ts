import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as N3 from 'n3';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) {
   }

  ngOnInit(): void {
    this.fetchInteractiveResources();
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
            console.log(item);
            // this.loadedStories.push(item);
          }
        });
        // this.buildTimeline(this.loadedItems);
        console.log(this.loadedStories);
        // this.timeline = new Timeline('timeline-embed', this.timeline_json, this.options);
      });
  }
}
