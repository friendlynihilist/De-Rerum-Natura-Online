import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
} from '@angular/core';
// import * as L from 'leaflet';
import L, { TileLayerOptions, MapOptions } from 'leaflet';
import { Icon } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';
import { parser } from '../parsers';

/**
 * Interface for TileLayer's "data"
 *
 * @property url (required)
 * @property options (required)
 */
export interface TileLayerData {
  url: string;
  options: TileLayerOptions;
}
/**
 * Interface for Marker's "data"
 *
 * @property coords (required)
 * @property title (optional)
 * @property template (required)
 */
export interface MarkerData {
  coords: [number, number];
  title?: string;
  template: string;
  icon?: any;
}

/**
 * Interface for MapComponent's "data"
 *
 * @property containerId (required)
 * @property tileLayers (required)
 * @property initialView (required)
 * - center (required)
 * - zoom (required)
 * @property markers (optional)
 */
export interface MapData {
  /** Id of the map container element */
  containerId: string;
  /** Leaflet map layers */
  tileLayers: TileLayerData[];
  /** Leaflet map options */
  libOptions?: MapOptions;
  /** Leaflet cluster options */
  clusterLibOptions?: any;
  /** Coordinates of the initial view */
  initialView: {
    /** Coordinates tuple */
    center: [number, number];
    /** Zoom distance */
    zoom: number;
  };
  /** Collection of map markers */
  markers?: MarkerData[];
  /** Sets the map instance to the given parameter */
  _setInstance?: (map) => void;
  /** Sets the marker layer to the given parameter */
  _setMarkerLayer?: (markerLayer) => void;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  defaultLang = 'en-EN';

  geoNamesList = [];

  isDataAvailable = false;

  data: any = {
    containerId: 'map-canvas',
    tileLayers: [
      {
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        options: {},
      },
    ],
    initialView: {
      center: [45.464, 9.188],
      zoom: 7,
    },
    markers: [
      {
          "coords": [
              "41.89193",
              "12.51133"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/c03cfc0843862a6b1ff72f73954d47cfefe2fe0d.jpg\"/>\n                            <h3>Natura decomposta</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3169070\">Geonames</a></p>\n                            ",
          "title": "Rome"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/f189cd796a1fc5da4a4f813a4f11c63e9dedc96e.jpg\"/>\n                            <h3>Donne nude</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "48.81999",
              "2.29998"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/5388cd0aac5bcbc3e02caeda854a8cbb3e34d644.jpg\"/>\n                            <h3>La peste d'Atene - 2</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/2996514\">Geonames</a></p>\n                            ",
          "title": "Malakoff"
      },
      {
          "coords": [
              "43.77925",
              "11.24626"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/fca823cfc835ce2d4a918b1bbd03f0876f28a009.jpg\"/>\n                            <h3>La natura delle cose</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3176959\">Geonames</a></p>\n                            ",
          "title": "Florence"
      },
      {
          "coords": [
              "50.93333",
              "6.95"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/2f79093b34ede76333d44c9a4de9842094e0d6db.jpg\"/>\n                            <h3>Guai ai gelidi mostri</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/2886242\">Geonames</a></p>\n                            ",
          "title": "Cologne"
      },
      {
          "coords": [
              "-37.814",
              "144.96332"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/8069cb159ed0976b9849739ec56d927f26a3f14e.jpg\"/>\n                            <h3>Clinamen</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/2158177\">Geonames</a></p>\n                            ",
          "title": "Melbourne"
      },
      {
          "coords": [
              "43.30341",
              "12.33749"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/14310cb3a6cd65c2e3fe854003e0f65290cbb16e.jpg\"/>\n                            <h3>Here comes the sun</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3165052\">Geonames</a></p>\n                            ",
          "title": "Umbertide"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/fbf353c1c91b526c1c7660f3ecc3b0cbd958c2f2.jpg\"/>\n                            <h3>Vecchio sotto una pianta</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "42.83333",
              "12.83333"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/2a6a81cc717ed3ff02cdf9776391e1c86c7ee3ef.jpg\"/>\n                            <h3>Cose naturali</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3175395\">Geonames</a></p>\n                            ",
          "title": "Italy"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/c352a19d854782d319419d58a772e37981d3eaf3.jpg\"/>\n                            <h3>Passaggio</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "49.23262",
              "7.00982"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/34130b5fae9221897dbf0774e906cfbfc72cb97b.jpg\"/>\n                            <h3>Lucrezio. Un oratorio materialistico - Parte II: Amore</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/2842647\">Geonames</a></p>\n                            ",
          "title": "Saarbrücken"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/bb5202f6b2169717cda8c98a8e3610219896a636.jpg\"/>\n                            <h3>La morte</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "43.77925",
              "11.24626"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/278969388fd87c52baaf3bdcef73f57b398f1959.jpg\"/>\n                            <h3>Lucrezio. Un oratorio materialistico - Parte I: Natura</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3176959\">Geonames</a></p>\n                            ",
          "title": "Florence"
      },
      {
          "coords": [
              "45.58005",
              "9.27246"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/b7f5b6acedbcb91ba7968eac972db5a3d2447ff4.jpg\"/>\n                            <h3>Casa di Lucrezio, 1981</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3172629\">Geonames</a></p>\n                            ",
          "title": "Monza"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/42f7fa9af16f0affe87cf00263a13494373caeea.jpg\"/>\n                            <h3>I bambini muoiono</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "43.77925",
              "11.24626"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/77347850278ce8e5e9e3b60ed495a1f0360bd9de.jpg\"/>\n                            <h3>Casa di Lucrezio,  1981</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3176959\">Geonames</a></p>\n                            ",
          "title": "Florence"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/77b65c2efc79b853f116df23b51c86102266f29b.jpg\"/>\n                            <h3>Mostro</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/1f9bd68d2d71b71c9a1e32bd440e8a8a07b282c9.jpg\"/>\n                            <h3>Il gufo</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/a04c908cc0baf184f57eb53e64ee6c0010c950a0.jpg\"/>\n                            <h3>Donna urlante</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      },
      {
          "coords": [
              "45.46427",
              "9.18951"
          ],
          "template": "\n                            <img src=\"http://137.204.168.14/lib/files/medium/243d8ffc5901dc8d4c14b12f5a8cfa8959a358a5.jpg\"/>\n                            <h3>Silenzio</h3>\n                            <p>External reference: <a href=\"https://www.geonames.org/3173435\">Geonames</a></p>\n                            ",
          "title": "Milan"
      }
  ]
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): any {
    this.fetchItems();
  }

  ngAfterViewInit(): void {}

  /** Knows if the component is loaded */
  private _loaded = false;
  loadedItems = [];

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
      spatial: {
        label: '',
        lat: null,
        lng: null,
      },
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

        case 'dcterms:spatial':
          item[property].map(async (hit) => {
            if (hit.type === 'uri') {
              dataModel.spatial.label = hit['o:label'];
              console.log('spatial');
              if (dataModel.spatial.label) {
                await fetch(
                  `http://api.geonames.org/searchJSON?name=${dataModel.spatial.label}&maxRows=1&username=lucretiusdrn`
                )
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(res.geonames);
                    for (const key in res) {
                      if (key === 'geonames') {
                        if (res[key]?.length > 0) {
                          
                          this.data.markers.push({
                            coords: [res[key][0]['lat'], res[key][0]['lng']],
                            template: `
                            <img src="${item.thumbnail_display_urls.medium}"/>
                            <h3>${dataModel.title ? dataModel.title : item['dcterms:title'][0]['@value']}</h3>
                            <p>External reference: <a href="https://www.geonames.org/${res[key][0]['geonameId']}">Geonames</a></p>
                            `,
                            title: res[key][0]['name'],
                          });
                        }
                      }
                    }
                  })
                  .then(() => console.log(this.data.markers));
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
  };

  fetchItems = async () => {
    //private?
    await this.http
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
          return itemsArray; //retrieve an array of all the items in the collection
        })
      )
      .subscribe((items) => {
        items.map((item) => {
          // console.log(item);
          // item is been parsed in order to retrieve media from the o:media property URI
          this.createDataModel(parser.parseMedia(item));
          this.loadedItems.push(item); // add parser.parseRDF?
        });
      });
    console.log(this.loadedItems);
  };

  /** Dynamically load required node modules */
  private loadModules = async () => ({
    leaflet: await import('leaflet'),
    cluster: await import('leaflet.markercluster'),
  });

  ngAfterContentChecked(): void {
    if (!this.data || this._loaded) return;
    this._loaded = true;
    setTimeout(() => {
      this.loadModules().then((modules) => {
        /** Module definitions */
        const lflet: any = modules.leaflet;
        const clstr: any = modules.cluster;
        // Merge cluster and leaflet into leaflet
        const leaflet = { ...lflet, ...clstr };
        // Create a map
        const { center, zoom } = this.data.initialView;
        const map = leaflet
          .map(this.data.containerId, this.data.libOptions)
          .setView(center, zoom);
        this.data.tileLayers.forEach((layer) => {
          leaflet.tileLayer(layer.url, layer.options).addTo(map);
        });

        /** Handle events */
        // map.on('click', this.onMapClick);

        /** Handle markers */
        if (this.data.markers) {
          const markers = leaflet.markerClusterGroup(
            this.data.clusterLibOptions
          );
          this.data.markers.forEach((mrk) => {
            leaflet.marker(mrk.coords).addTo(markers).bindPopup(mrk.template);
          });
          map.addLayer(markers);
          if (this.data._setMarkerLayer) this.data._setMarkerLayer(markers);
        }

        // Assign the map instance
        if (this.data._setInstance) this.data._setInstance(map);
      });
    });
  }
}
