import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parser } from '../parsers';
import { TL, Timeline } from '@knight-lab/timelinejs/src/js/index';

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
        console.log(this.loadedItems);
        this.buildTimeline(this.loadedItems);
        new Timeline('timeline-embed', this.timeline_json, this.options);
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
