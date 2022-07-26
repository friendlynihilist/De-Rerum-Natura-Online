import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  data: any;

  constructor(private http: HttpClient) {}

  fetchItems(): Observable<any> {
    return this.http.get('https://137.204.168.14/lib/api/items').pipe(
      map((responseData) => {
        const itemsArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            itemsArray.push({ ...responseData[key] });
          }
        }
        return itemsArray;
      })
    );
  }
}
