import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as N3 from 'n3';
import { namedNode } from 'n3/src/N3DataFactory';
import { DataFactory } from 'rdf-data-factory';
// import { WorkService } from './work.service';
// import { Work } from './work';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss'],
})
export class WorkComponent implements OnInit {
  loadedItems = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchItems();
  }

  // parsingArray = [];

  parseRDFS(item) {
    let parsingArray = [];
    const parser = new N3.Parser({ format: 'N-Triples' });
        parser.parse(`<https://137.204.168.14/lib/api/items/3><http://www.w3.org/2000/01/rdf-schema#seeAlso><http://data.perseus.org/texts/urn:cts:latinLit:phi0550.phi001.perseus-lat1>.
        <https://137.204.168.14/lib/api/items/5><http://www.w3.org/2000/01/rdf-schema#seeAlso><http://data.perseus.org/texts/urn:cts:latinLit:phi0550.phi001.perseus-lat1>.
        <https://137.204.168.14/lib/api/items/31><http://www.w3.org/2000/01/rdf-schema#seeAlso><http://data.perseus.org/texts/urn:cts:latinLit:phi0550.phi001.perseus-lat1>.
        <https://137.204.168.14/lib/api/items/31><http://www.w3.org/2000/01/rdf-schema#seeAlso><http://mydomain.org/texts/sometext-fragment>.`, (error, quad, prefixes) => {
          const store = new N3.Store();
          store.addQuad(quad); // .addQuads
          const uri = item["@id"];
          const searchQuad = store.getQuads(
            namedNode(uri),
            null,
            null
          )[0];

          const countQuad = store.countQuads(
            namedNode(uri),
            null,
            null
          );

          if (searchQuad !== undefined) {
            parsingArray.push(searchQuad);
          }

          // console.log(searchQuad);
          // console.log(countQuad);
        });
      console.log(parsingArray);
      return item;
  }

  parseRDF(item) {
    item.ref_count = 0;
    let refCount = 0;
    fetch('../../assets/tei-ref/de-rerum-natura.nt')
      .then((response) => response.text())
      .then((data) => {
        // Do something with your data
        const parser = new N3.Parser({ format: 'N-Triples' });
        parser.parse(data, (error, quad, prefixes) => {

          const factory = new DataFactory();
          const store = new N3.Store();

          store.addQuad(quad); // .addQuads
          const uri = item["@id"];
          const searchQuad = store.getQuads(
            factory.namedNode(uri)
          );
          for (const quad of searchQuad) {
            if(quad.subject.value === uri)
            {
              item.ref_count++
            }
          }
          // if (searchQuad !== undefined) {
          //   refCount++
          //   item.ref_count++
          // }
          // console.log(searchQuad + ': ' + refCount.toString());
        });
      });
      return item;
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
        items.map((item) => this.loadedItems.push(this.parseRDF(item)));
        // console.log(this.parsingArray);
        // console.log(this.loadedItems.map((item) => item));
        // this.loadedItems = items;
      });
  }
}
