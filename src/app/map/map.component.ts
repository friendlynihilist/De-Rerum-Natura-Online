import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentChecked,
} from '@angular/core';
// import * as L from 'leaflet';
import * as L from 'leaflet';
import { TileLayerOptions, MapOptions } from 'leaflet';
import { Icon } from 'leaflet';
import { HttpClient } from '@angular/common/http';
import { filter, map, take } from 'rxjs/operators';
import { parser } from '../parsers';
import { Observable, Subject } from 'rxjs';
import { LoadingService } from '../loading.service';
import { MapService } from '../map.service';

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
    ],
  };



  loading$ = this.loader.loading$;

  constructor(private http: HttpClient, public loader: LoadingService, public mapData: MapService) {
    // this.fetchItems();
  }

  ngOnInit(): any {
    this.fetchItems();
  }

  ngAfterViewInit(): void {}

  /** Knows if the component is loaded */
  private _loaded = false;
  loadedItems = [];

  MARKER_ICON = L.icon({
    iconUrl: '/assets/pin.png',
    iconSize: [20, 30.5],
    popupAnchor: [0, -25],
    className: 'marker-icon',
  });

  MARKER_ICON_SELECTED = L.icon({
    iconUrl: '/assets/pin-selected.png',
    iconSize: [30, 45.5],
    popupAnchor: [0, -25],
    className: 'marker-icon-selected',
  });

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
              // console.log('spatial');
              if (dataModel.spatial.label) {
                await fetch(
                  `http://api.geonames.org/searchJSON?name=${dataModel.spatial.label}&maxRows=1&username=lucretiusdrn`
                )
                  .then((res) => res.json())
                  .then((res) => {
                    // console.log(res.geonames);
                    for (const key in res) {
                      if (key === 'geonames') {
                        if (res[key]?.length > 0) {
                          this.data.markers.push({
                            coords: [res[key][0]['lat'], res[key][0]['lng']],
                            template: `
                            <img src="${item.thumbnail_display_urls.medium}"/>
                            <h3>${
                              dataModel.title
                                ? dataModel.title
                                : item['dcterms:title'][0]['@value']
                            }</h3>
                            <p>External reference: <a href="https://www.geonames.org/${
                              res[key][0]['geonameId']
                            }" target="_blank">Geonames</a></p>
                            `,
                            title: res[key][0]['name'],
                          });
                        }
                      }
                    }
                  })
                  // .then(() => 
                  // console.log(this.data.markers)
                  // );
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

  public fetchItems() {
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
          // console.log(itemsArray);
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
    // console.log(this.loadedItems);
  }

  /** Dynamically load required node modules */
  private loadModules = async () => ({
    leaflet: await import('leaflet'),
    cluster: await import('leaflet.markercluster'),
  });

  public markerOpen$: Subject<object> = new Subject();
  public markerClose$: Subject<void> = new Subject();

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
            leaflet
              .marker(mrk.coords, { icon: this.MARKER_ICON })
              .addTo(markers)
              .bindPopup(mrk.template);
          });
          map.addLayer(markers);
          if (this.data._setMarkerLayer) this.data._setMarkerLayer(markers);
        }
        // Assign the map instance
        if (this.data._setInstance) this.data._setInstance(map);
      });
    }, 2500);
  }
}
