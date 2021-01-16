import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parser } from '../parsers';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  loadedItems = [];

  fetchItems() {
    //private?
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
        items.map((item) => this.loadedItems.push(parser.parseMedia(item)));
        this.buildTimeline(this.loadedItems);
      });
  }

  buildTimeline(arr) {
    console.log(arr);
    const searchValue = (item) => {
      for (let field of item) {
        return field['@value'] || field['o:label'];
      }
    };
    arr.forEach((item) => {
      const timeline = {
        timeline: {
          events: [
            {
              media: {
                url: item.video_source
                  ? item.video_source
                  : item.thumbnail_display_urls.medium, // video_source || original_url
                // "caption": "",
                credit: searchValue(item['dcterms:creator']),
              },
              start_date: {
                year: searchValue(item['dcterms:date']),
              }, // dcterms:date
              text: {
                headline: item['o:title'], // o:title
                text: item['dcterms:description']
                  ? '<p>' +
                    searchValue(item['dcterms:description']) +
                    '</p>'
                  : null, // dcterms:description
              },
            },
          ],
        },
      };
      console.log(timeline);
      return timeline;
    });
  }

  timeline: {
    events: [
      {
        media: {
          url: ''; // video_source || original_url
          caption: '';
          credit: '';
        };
        start_date: {
          year; // dcterms:date
        };
        text: {
          headline: ''; // o:title
          text: '<p></p>'; // dcterms:description
        };
      }
    ];
  };
}
