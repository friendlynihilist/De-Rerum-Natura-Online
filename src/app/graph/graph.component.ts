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
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  defaultLang = 'en-EN';
  loadedItems = [];
  reserved = [];
  order;
  isArrayLoaded: boolean = false;

  private data = [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }];
  svg;
  node;
  circles;
  margin;
  width;
  height;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // this.fetchItems();
    this.createSvg();
  }

  private createSvg(): void {
    this.svg = d3
      .select('#clinamen')
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.node = this.svg.append('g').selectAll('nodes').data(this.data).enter();

    this.circles = this.node
      .append('circle')
      .attr('cx', () => {
        return Math.random() * this.width;
      })
      .attr('cy', () => {
        return Math.random() * this.height;
      })
      .attr('r', 40)
      .style('fill', 'rgb(239, 192, 80)');
  }

  createDataModel(item) {
    // FIXME: move to parser
    let lang = this.defaultLang;
    const dataModel = {
      creator: [],
      title: '',
      date: '',
      description: [],
      subject: [],
      type: [],
    };

    Object.keys(item).map((property) => {
      // console.log(item[property]);
      switch (property) {
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
          break;
      }
    });

    item.metadata = dataModel;
  }

  fetchItems() {
    //FIXME: move to helpers
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
          return itemsArray; //retrieve an array of all the items in the collection
        })
      )
      .subscribe((items) => {
        items.map((item) => {
          // console.log(item);
          // item is been parsed in order to retrieve media from the o:media property URI
          this.createDataModel(item);
          this.loadedItems.push(parser.parseMedia(item)); // add parser.parseRDF?
        });
      });
    // console.log(this.loadedItems);
  }
}
