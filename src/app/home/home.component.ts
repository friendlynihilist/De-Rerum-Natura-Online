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
            if("thumbnail_display_urls" in item && item["thumbnail_display_urls"]["large"]) {
              this.loadedStories.push(item);
            }
          }
        });
        console.log(this.loadedStories);
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
