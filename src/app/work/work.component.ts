import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { parser } from '../parsers';
import { access } from 'fs';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit, AfterViewChecked, AfterViewInit {
  loadedItems = [];
  filteredItems = [];
  order;
  isArrayLoaded: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchItems();
    this.enableDropDown();
    console.log(this.filteredItems);
  }

  ngAfterViewInit() {
  }

  ngAfterViewChecked() {
    this.waitToLoad();
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

  filterItems() {
    let filteredArray = [];
    this.loadedItems.map((item) =>
      item['dcterms:creator'].map((field) => {
        if (field['o:label'] || field['@value']) {
          filteredArray.push(field['o:label'] || field['@value'])
        }
      })
    );
    let filteredSet = [ ...new Set(filteredArray) ];
    for (let value of filteredSet) {
      let count = filteredArray.filter(x => x == value).length;
      this.filteredItems.push({
        "value": value,
        "count": count
      });
    }
  }

  sortAscItems(array) {
    array.sort(function (a, b) {
      let nameA = a['o:title'].toUpperCase(); // ignora maiuscole e minuscole
      let nameB = b['o:title'].toUpperCase(); // ignora maiuscole e minuscole
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }

      // i nomi devono essere uguali
      return 0;
    });
  }

  sortDescItems(array) {
    array.sort(function (a, b) {
      let nameA = a['o:title'].toUpperCase(); // ignora maiuscole e minuscole
      let nameB = b['o:title'].toUpperCase(); // ignora maiuscole e minuscole
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      // i nomi devono essere uguali
      return 0;
    });
  }

  switchSort() {
    if (this.order === false) {
      this.sortDescItems(this.loadedItems);
      this.order = true;
    } else {
      this.sortAscItems(this.loadedItems);
      this.order = false;
    }
  }

  enableDropDown() {
    var acc = document.getElementsByClassName('accordion');
    var i;

    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener('click', function () {
        this.classList.toggle('active');
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    }
  }

  waitToLoad() {
    this.isArrayLoaded = false;
    setTimeout(
      function () {
        this.isArrayLoaded = true;
      }.bind(this),
      1000
    );
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
        items.map((item) =>
          this.loadedItems.push(parser.parseMedia(parser.parseRDF(item)))
        );
        this.sortDescItems(this.loadedItems);
        this.filterItems();
      });
  }
}
