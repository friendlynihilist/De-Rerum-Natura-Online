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
  
  activeFilters = {};
  loadedItems = [];
  loadedItemsFiltered = [];
  
  relations = {};
  itemsets = [];

  filteredItems = []; //
  reserved = [];
  order;
  isArrayLoaded: boolean = false;
  JSON = JSON;

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
    this._fetchItemSets().then(itemsets => {
      this.itemsets = itemsets;
    });
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

  _getDcTermRelationItemSet(relation) {
    let ret = "";
    for (let i = 0; i < relation.length; i++) {
      const element = relation[i];
      if(!("@id" in element)) { continue; }
      if(! element["@id"].startsWith("http://137.204.168.14/lib/api/item")) { continue; }
      ret = element["@id"];
    }
    return ret;
  }

  async _getRelations(items) {
    let relation_urls = [];
    this.relations = {};
    for (let i = 0; i < items.length; i++) {
      const element = items[i];
      console.log("1");
      if(!("dcterms:relation" in element)) { continue }
      console.log("2");
      console.log(element["dcterms:relation"]);
      const element_relation_uri = this._getDcTermRelationItemSet(element["dcterms:relation"]);
      if(element_relation_uri == "") { continue }
      console.log(element_relation_uri);
      console.log("3");
      relation_urls.push(element_relation_uri);
      // if(!(element_relation_uri in this.relations)) {
      //   this.relations[element_relation_uri] = {};
      // }
    }
    relation_urls = [...new Set(relation_urls)];
    for (let i = 0; i < relation_urls.length; i++) {
      const relation_url = relation_urls[i];
      this.http.get(relation_url).toPromise().then( relation_data => {
        if(!relation_data["@type"].includes("dctype:Collection")) { return; }
        // if(!("dcterms:title" in relation_data)) { return; }
        // if(!("dcterms:description" in relation_data)) { return; }
        // if(!("dcterms:relation" in relation_data)) { return; }
        const relation_title = relation_data["dcterms:title"][0]["@value"];
        const relation_description = relation_data["dcterms:description"][0]["@value"];
        const relation_items = relation_data["dcterms:relation"].map( e => e["@id"]);
        console.log({relation_title, relation_description, relation_items});  
      });
      // for
    }
    console.log({ relation_urls });
  }

  _checkDcTermMatch(list, value) {
    // console.log("---> _checkDcTermMatch");
    // console.log(`checking for ${value}`);
    // only 1 match
    let match = false;
    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      match = match || element["@value"] == value;
    }
    // console.log((match ? "found!" : "not found..."));
    return match;
  }

  _checkFilterTypeMatch(activeFilterGroupItems, filterType, element) {
    // all must match
    let match = true;
    for (let groupItemIndex = 0; groupItemIndex < activeFilterGroupItems.length; groupItemIndex++) {
      const activeFilterGroupItem = activeFilterGroupItems[groupItemIndex];
      const dcTerm = `dcterms:${filterType}`;
      if(!(dcTerm in element) || !element[dcTerm]) {
        match = false;
      }
      // console.log(`looking at ${dcTerm}`);
      // console.log(`element[dcTerm] - element[${dcTerm}]`);
      // console.log(element[dcTerm]);     
      match = match && this._checkDcTermMatch(element[dcTerm], activeFilterGroupItem);
      // dcTermMatchAll = dcTermMatch && dcTermMatchAll;
    }
    return match
  }

  _itemMatch(activeFilters, element) {
    this.collectionDescription = '';
    const dcTerms = [
      "creator",
      "date",
      "subject",
      "type",
    ];
    // all must match
    let match = true;
    for(let filterType in activeFilters) {
      if(match == false) { break; }
      console.log(`filterType: ${filterType}`);
      // if this filter is in the dcTerms array
      if(dcTerms.includes(filterType)) {
        // get the current active filter
        const filterTypeItems = activeFilters[filterType];
        // get active filter group items
        let activeFilterGroupItems = Object.keys(filterTypeItems).filter((key) => filterTypeItems[key] == true);
        match = match && this._checkFilterTypeMatch(activeFilterGroupItems, filterType, element);
      } else if(filterType == "category") {
        const categoryFilters = activeFilters[filterType];
        for(let categoryFilter in categoryFilters) {
          if(!categoryFilters[categoryFilter]) { continue; }
          console.log(`looking for: ${categoryFilter} - current: ${element.metadata.category}`)
          match = match && element.metadata.category == categoryFilter;
        }
      } else if( filterType == "collection") {
        const collectionFilters = activeFilters[filterType];
        for(let collectionFilter in collectionFilters) {
          if(!collectionFilters[collectionFilter]) { continue; }
          const itemset = this.itemsets.find( itemset => {
            console.log(`${itemset["o:title"]} == ${collectionFilter}`);
            return itemset["o:title"] == collectionFilter
          });
          this.collectionDescription = itemset['dcterms:description'][0]['@value'];
          const valid_ids = itemset["dcterms:relation"].map( relation => relation.value_resource_id );
          console.log({valid_ids});
          match = match && valid_ids.includes(element["o:id"]);
        }
        // console.log("214")
        // console.log({collectionFilter})
        // const itemset = this.itemsets.find( itemset => {
        //   return itemset["o:title"] == collectionFilter
        // });
        // const valid_ids = 
        // value_resource_id
        // console.log({collectionFilter})
      }
    }
    return match;
  }

  async _fetchItemSets() {
    const itemsets = <Array<any>>await this.http.get("http://137.204.168.14/lib/api/item_sets").toPromise();
    const collections = itemsets
      .filter( itemset => itemset["@type"].includes("dctype:Collection") &&
                          "dcterms:relation" in itemset &&
                          itemset["dcterms:relation"].length > 0);
    console.log({collections});
    return collections;
  }

  _updateFilteredItems() {
    let _filteredItems = [];
    // for every loaded item
    for (let i = 0; i < this.loadedItems.length; i++) {
      // get the current item
      const element = this.loadedItems[i];
      // for every active filter group
      const itemMatch = this._itemMatch(this.activeFilters, element);
      if(itemMatch) {
        _filteredItems.push(element);
      }

      // for(let filterType in this.activeFilters) {
      //   // if this filter is in the dcTerms array
      //   if(dcTerms.includes(filterType)) {
      //     // get the current active filter
      //     const filterTypeItems = this.activeFilters[filterType];
      //     // get active filter group items
      //     let activeFilterGroupItems = Object.keys(filterTypeItems).filter((key) => filterTypeItems[key] == true);
      //     // for every active filter group item
      //     let filterTypeMatches = this._checkFilterTypeMatch(activeFilterGroupItems, filterType, element);
      //     if(filterTypeMatches) {
      //       console.log("match!");
      //       _filteredItems.push(element);
      //     }
      //   }
      // }
      // _filteredItems.push(element);
    }
    this.loadedItemsFiltered = _filteredItems;
  }

  _addFilter(value, label) {
    console.log(["_addFilter: ", value, label])
    // init object if key does not exist
    if(!(label in this.activeFilters)) { this.activeFilters[label] = {}; }
    if((value in this.activeFilters[label])) {
        if(this.activeFilters[label][value] == true) {
          this.activeFilters[label][value] = false;
          this._updateFilteredItems();
          return;
        }
    }
    this.activeFilters[label][value] = true;
    this.activeFilterBadges.push({ label: value, type: label });
    console.log({
      activeFilters: this.activeFilters
    });
    this._updateFilteredItems();
  }

  _removeFilter(value, label) {
    if(!(label in this.activeFilters)) { return; }
    if(!(value in this.activeFilters[label])) { return; }
    delete this.activeFilters[label][value];

    console.log({
      activeFilters: this.activeFilters
    });
    this._updateFilteredItems();
  }

  _filter() {

  }

  filterItems(selectedFilter, type) {
    // if (type == "category") {
      
    // } if (type == "relation") {

    // } else {

    // }
    // console.log("---> filterItems");
    // console.log({ selectedFilter, type });
    // return;
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
    // FIXME: BISOGNA ITERARE PER VEDERE LA RELATION CHE HA ITEM SETS E SOLO QUELLA CHE CORRISPONDE NEL display_title
    this.http.get(item['dcterms:relation'][0]['@id']).subscribe((data) => {
      console.log(item);
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
      this.sortDescItems(this.loadedItemsFiltered);
      // this.sortDescItems(this.loadedItems);
      this.order = true;
    } else {
      this.sortAscItems(this.loadedItemsFiltered);
      // this.sortAscItems(this.loadedItems);
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
          const parsedMedia = parser.parseMedia(item);
          this.loadedItems.push(parsedMedia); // add parser.parseRDF?
          this.loadedItemsFiltered.push(parsedMedia); 
        });
        // this._getRelations(this.loadedItems);
        this._getRelations(this.loadedItemsFiltered);
        this.sortDescItems(this.loadedItems);
        this.sortDescItems(this.loadedItemsFiltered);
        for (let type of this.filterTypesArray) {
          // ['creator', 'date', 'subject', 'type'];
          this.getFilters(type);
        }

      });
    // console.log(this.loadedItems);
  }
}
