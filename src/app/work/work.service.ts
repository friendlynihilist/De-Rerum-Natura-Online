import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Work } from './work';

@Injectable({
  providedIn: 'root',
})
export class WorkService {
  loadedItems = [];

  constructor(private http: HttpClient) {
    // this.workConf();
  }

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
        //...
        // this.loadedItems = this.buildItems(items);
        // let rawOverview = JSON.parse(JSON.stringify(items));
        // console.log(this.buildItems(items));
        // console.log(this.renderData(this.buildItems(items)));
        this.loadedItems = items;
        // console.log(this.loadedItems);
      });
  }

  loadedWork: {
    id: 1;
    title: 'Caso';
    creator: 'Tizio';
  };

  // workConf() {
  //   let item: {
  //     id: 1,
  //     title: 'Caso',
  //     creator: 'Tizio'
  //   }
  //   this.loadedWork = item;
  // }

  public getWorks() {
    let works: Work[];

    works = [
      new Work(1, 'Prova_1', 'Carlo'),
      new Work(2, 'Prova_2', 'Gigi', 'immagine_2'),
      new Work(3, 'Prova_3', 'Luigi', 'immagine_3'),
    ];

    return works;
  }

  public getWork(id) {
    let works: Work[] = this.getWorks();
    return works.find((p) => p.id == id);
  }
}
