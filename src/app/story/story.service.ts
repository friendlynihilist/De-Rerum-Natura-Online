import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Story } from './story';

@Injectable({
  providedIn: 'root'
})
export class StoryService {

  loadedStories = [];

  constructor(private http: HttpClient) { }

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

  public getStories() {
    let stories: Story[];

    stories = [
      new Story(1, 'Prova_1'),
      new Story(2, 'Prova_2'),
      new Story(3, 'Prova_3'),
    ];

    return stories;
  }

  public getStory(id) {
    let stories: Story[] = this.getStories();
    return stories.find((p) => p.id == id);
  }
}
