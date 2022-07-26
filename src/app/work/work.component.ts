import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { parser } from '../parsers';
import { access } from 'fs';
import { style } from '@angular/animations';
import { timeStamp } from 'console';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit, AfterViewChecked, AfterViewInit {
  filterTypesArray = [
    'creator',
    'date',
    'subject',
    'type',
    'category',
    'relation',
  ]; //FIXME: move to config
  defaultLang = 'it-IT';

  loading$ = this.loader.loading$;
  
  loadedItems = [];
  filteredItems = []; //
  reserved = [];
  order;
  isArrayLoaded: boolean = false;

  constructor(private http: HttpClient, public loader: LoadingService) {}


  // on initialization, filterTypesArray is iterated and the function getFilters(type) is called for every type of the array.
  // getFilters(type) iterates over every item from loadedItems on the passed DC property (e.g. creator) and takes the value from it
  // and put it into a temporary array. Then a Set is made from this array in order to remove the duplicates. Finally,
  // the global filteredItems array is populated with objects {label: type, value: value, count: count}.
  // the filters are loaded in the DOM by using Angular Directives and template syntax. By clicking on a filter,
  // filterItems(selectedFilter, type) is called with the value and the type of the selected filter (e.g. Giulio Paolini, creator).
  // A temporary array is created by filtering loadedItems in order to retrieve only the items that contains the requested property.
  // If the filter is not yet in filterSwitch global array, loadedItems will be updated with filteredArray, thus

  ngOnInit() {
    this.fetchItems();
    this.enableDropDown();
  }

  ngAfterViewInit() {}

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

  filterSwitch = [];

  removeFilter(selectedFilter) {
    this.reserved.map((element) => {
      let key = Object.keys(element)[0];
      if (selectedFilter === key) {
        this.loadedItems = element[key];
        document
          .getElementById(selectedFilter)
          .classList.remove('active-filter');
        let index = this.filterSwitch.indexOf(selectedFilter);
        this.filterSwitch.splice(index, 1);
        for (let badge of this.activeFilterBadges) {
          if (selectedFilter === badge.label) {
            let index = this.activeFilterBadges.indexOf(badge);
            this.activeFilterBadges.splice(index, 1);
          }
        }
      }
    });
    if (this.collectionDescription) {
      this.collectionDescription = '';
    }
  }

  filterItems(selectedFilter, type) {
    let filteredArray = [];
    if (type === 'category') {
      filteredArray = this.loadedItems.filter(
        (
          item // create the array with all the filtered items which includes the selected filters
        ) =>
          item['@type'].some(
            (
              field // .filter needs a boolean, hence the use of .every and .includes
            ) =>
              selectedFilter ===
              field
                .replace('dctype:', '')
                .replace('bibo:', '')
                .split(/(?=[A-Z])/)
                .join(' ')
          )
      );
    } else if (type === 'relation') {
      this.loadedItems.map((item) => {
        if (typeof item[`dcterms:${type}`] !== 'undefined') {
          item[`dcterms:${type}`].map((field) => {
            if (field['value_resource_name'] === 'item_sets') {
              if (selectedFilter === field['display_title']) {
                console.log(item);
                filteredArray.push(item);
              }
            }
          });
        }
      });
    } else {
      filteredArray = this.loadedItems.filter(
        (
          item // create the array with all the filtered items which includes the selected filters
        ) =>
          item[`dcterms:${type}`].some(
            (
              field // .filter needs a boolean, hence the use of .every and .includes
            ) => selectedFilter.includes(field['o:label'] || field['@value'])
          )
      );
    }

    if (!this.filterSwitch.includes(selectedFilter)) {
      this.reserved.push({ [selectedFilter]: this.loadedItems });
      // console.log(this.reserved);
      this.loadedItems = filteredArray;
      // console.log(this.loadedItems);
      document.getElementById(selectedFilter).className += ' active-filter';
      this.createFilterBadges(selectedFilter, type); //add type

      // CREATE COLLECTION DESCRIPTION
      if (type === 'relation') {
        this.createCollectionDescription(this.loadedItems[0]);
      }
      //

      this.filterSwitch.push(selectedFilter);
    } else {
      this.removeFilter(selectedFilter);

      // DESTROY COLLECTION DESCRIPTION
      if (this.collectionDescription) {
        this.collectionDescription = '';
      }
      //
    }
  }

  activeFilterBadges = [];
  createFilterBadges(selectedFilter, type) {
    //add type param
    this.activeFilterBadges.push({ label: selectedFilter, type: type });
  }

  collectionDescription;
  createCollectionDescription(item) {
    
    this.http.get(item['dcterms:relation'][0]['@id']).subscribe((data) => {
      if (data['dcterms:description'][0]['@value']) {
        this.collectionDescription = data['dcterms:description'][0]['@value'];
      }
    });
    // this.collectionDescription = item.metadata.relation[0].description;
  }

  getFilters(type) {
    let filteredArray = [];
    this.loadedItems.map((item) => {
      if (item.metadata[type]) {
        //['creator', 'date', 'subject', 'type'];
        if (Array.isArray(item.metadata[type])) {
          item.metadata[type].map((field) => {
            if (field) {
              if (typeof field === 'object') {
                filteredArray.push(field.filter);
              } else {
                filteredArray.push(field);
              }
            }
          });
        } else {
          filteredArray.push(item.metadata[type]);
        }
      }
    });
    let filteredSet = [...new Set(filteredArray)];
    // console.log(filteredSet);
    for (let value of filteredSet) {
      let count = filteredArray.filter((x) => x == value).length;
      this.filteredItems.push({
        label: type,
        value: value,
        count: count,
      });
    }
    // console.log(this.filteredItems);
  }

  createDataModel = async (item) => {
    // FIXME: move to parser?
    let lang = this.defaultLang;
    const dataModel = {
      creator: [],
      title: '',
      date: '',
      description: [],
      subject: [],
      type: [],
      category: '',
      relation: [],
      citation: [],
    };

    Object.keys(item).map((property) => {
      // console.log(item[property]);
      switch (property) {
        case '@type':
          dataModel.category = item[property][1]
            .replace('dctype:', '')
            .replace('bibo:', '')
            .split(/(?=[A-Z])/)
            .join(' ');
          break;
        case 'dcterms:creator':
          item[property].map((hit) => {
            if (hit.type === 'literal' && hit['@language']) {
              if (hit['@language'] === lang) {
                // console.log(hit['@value']);
                dataModel.creator.push(hit['@value']);
              }
            }
          });
          break;

        case 'dcterms:relation':
          item[property].map(async (hit) => {
            if (hit.value_resource_name === 'item_sets') {

              dataModel.relation.push({
                uri: hit['@id'],
                filter: hit['display_title'],
              });

            }
          });
          break;

        case 'dcterms:date':
          dataModel.date = item[property][0]['@value'];
          break;

        case 'dcterms:title':
          dataModel.title = item[property][0]['@value'];
          break;

        case 'dcterms:description':
          item[property].map((hit) => {
            if (hit.type === 'literal' && hit['@language']) {
              if (hit['@language'] === lang) {
                dataModel.description.push(hit['@value']);
              }
            }
          });
          break;

        case 'dcterms:subject':
          item[property].map((hit) => {
            if (hit.type === 'literal' && hit['@language']) {
              if (hit['@language'] === lang) {
                // console.log(hit['@value']);
                dataModel.subject.push(hit['@value']);
              }
            }
          });
          break;

        case 'dcterms:type':
          item[property].map((hit) => {
            if (hit.type === 'literal' && hit['@language']) {
              if (hit['@language'] === lang) {
                dataModel.type.push(hit['@value']);
              }
            }
          });

        case 'dcterms:bibliographicCitation':
          item[property].map((hit) => {
            if (hit.type === 'uri') {
              // if (hit['@language'] === lang) {
              dataModel.citation.push({
                label: hit['o:label'],
                link: hit['@id'],
              });
              // }
            }
          });
          break;
      }
    });

    item.metadata = dataModel;
  };

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
      .get('http://137.204.168.14/lib/api/items')
      .pipe(
        map((responseData) => {
          const itemsArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              itemsArray.push({ ...responseData[key] });
            }
          }
          console.log(itemsArray);
          return itemsArray; //retrieve an array of all the items in the relation
        })
      )
      .subscribe((items) => {
        items.map((item) => {
          // console.log(item);
          // item is been parsed in order to retrieve media from the o:media property URI
          this.createDataModel(item);
          this.loadedItems.push(parser.parseMedia(item)); // add parser.parseRDF?
        });
        this.sortDescItems(this.loadedItems);
        for (let type of this.filterTypesArray) {
          // ['creator', 'date', 'subject', 'type'];
          this.getFilters(type);
        }
      });
    // console.log(this.loadedItems);
  }
}
