import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
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
import { html } from 'd3';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit, AfterContentInit {
  defaultLang = 'en-EN';
  loadedItems = [];
  reserved = [];
  order;
  isArrayLoaded: boolean = false;

  data: any = {
    nodes: [
      {
        id: 1,
        name: 'A',
      },
      {
        id: 2,
        name: 'B',
      },
      {
        id: 3,
        name: 'C',
      },
      {
        id: 4,
        name: 'D',
      },
      {
        id: 5,
        name: 'E',
      },
      {
        id: 6,
        name: 'F',
      },
      {
        id: 7,
        name: 'G',
      },
      {
        id: 8,
        name: 'H',
      },
      {
        id: 9,
        name: 'I',
      },
      {
        id: 10,
        name: 'J',
      },
    ],
    links: [
      {
        source: 1,
        target: 2,
      },
      {
        source: 1,
        target: 5,
      },
      {
        source: 1,
        target: 6,
      },
      {
        source: 2,
        target: 3,
      },
      {
        source: 2,
        target: 7,
      },
      {
        source: 3,
        target: 4,
      },
      {
        source: 8,
        target: 3,
      },
      {
        source: 4,
        target: 5,
      },
      {
        source: 4,
        target: 9,
      },
      {
        source: 5,
        target: 10,
      },
    ],
  };
  svg;
  node;
  circles;
  margin = { top: 10, right: 30, bottom: 30, left: 30 };
  width = 800 - this.margin.left - this.margin.right;
  height = 800 - this.margin.top - this.margin.bottom;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngAfterContentInit() {}

  /** Knows if the component is loaded */
  _loaded = false;

  ngAfterContentChecked() {
    if (!this.data || this._loaded) return;
    this._loaded = true;
    setTimeout(() => {
      this.createSvg();
    });
  }

  private createSvg(): any {
    // const x = d3
    //   .scaleLinear()
    //   .domain([0, 100])
    //   .range([0, this.width]);
    // const y = d3.scaleLinear().domain([0, 100]).range([0, this.height]);

    this.svg = d3
      .select('#clinamen')
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const simulation: any = d3
      .forceSimulation(this.data.nodes)
      .force(
        'link',
        d3
          .forceLink() // This force provides links between nodes
          .id(function (d: any) {
            return d.id;
          })
          .links(this.data.links)
      )
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .on('tick', ticked);

    const link = this.svg.selectAll('line').data(this.data.links).join('line');
    // .style('stroke', '#aaa');

    const div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    const Tooltip = d3
      .select('#clinamen')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px');

    const node = this.svg
      .selectAll('circle')
      .data(this.data.nodes)
      .join('circle')
      .attr('r', 20)
      .style('fill', '#69b3a2')
      .on('mouseover', function (event: any, d: any) {
        d3.select(this);
        Tooltip.style('opacity', 1);
        d3.select(this).style('stroke', 'black').style('opacity', 1);
      })
      .on('mousemove', function (event: any, d: any) {
        console.log(d);
        Tooltip.html('The exact value of<br>this cell is: ' + d.name)
        .style('left', d3.pointer(event)[0] + 200 + 'px')
        .style('top', d3.pointer(event)[1] + 'px');
      })
      .on('mouseout', function (event: any, d: any) {
        Tooltip.style('opacity', 0);
        d3.select(this).style('stroke', 'none').style('opacity', 0.8);
      })
      .call(drag(simulation));

    function ticked() {
      link
        .attr('x1', function (d) {
          d.source.x;
        })
        .attr('y1', function (d) {
          return d.source.y;
        })
        .attr('x2', function (d) {
          return d.target.x;
        })
        .attr('y2', function (d) {
          return d.target.y;
        });

      node
        .attr('cx', function (d) {
          return d.x + 6;
        })
        .attr('cy', function (d) {
          return d.y - 6;
        });
    }

    function drag(simulation) {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    }
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
