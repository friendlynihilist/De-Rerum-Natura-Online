import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterContentChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Story } from '../story/story';
import { TL, Timeline } from '@knight-lab/timelinejs/src/js/index';
import * as L from 'leaflet';
import { TileLayerOptions, MapOptions } from 'leaflet';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { parser } from '../parsers';
import { LoadingService } from '../loading.service';
import { StoryService } from '../story/story.service';
// import { TimelineComponent } from './../timeline/timeline.component';

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
  instance: any;
  /** Sets the map instance to the given parameter */
  _setInstance?: (map) => void;
  /** Sets the marker layer to the given parameter */
  _setMarkerLayer?: (markerLayer) => void;
}

/**
 * Interface for ImageViewerComponent's images "data"
 *
 * Here the main options available, for a complete guide of image settings
 * view the official openseadragon documentation https://openseadragon.github.io/
 * All available options here: https://openseadragon.github.io/docs/OpenSeadragon.html
 *
 * @property  type (required)
 * Admitted values:
 * 'image' | 'zoomifytileservice' | 'openstreetmaps' | 'tiledmapservice' | 'legacy-image-pyramid'
 * @property  height (optional) image height
 * @property  width (optional) image width
 * @property  url (required) image url
 * @property  buildPyramid (optional)
 * @property  crossOriginPolicy (optional) Admitted values 'Anonymous' | 'use-credentials' | false;
 */
export interface ImageData {
  type:
    | 'image'
    | 'zoomifytileservice'
    | 'openstreetmaps'
    | 'tiledmapservice'
    | 'legacy-image-pyramid';
  height?: number;
  width?: number;
  url: string;
  buildPyramid: boolean;
  crossOriginPolicy?: 'Anonymous' | 'use-credentials' | false;
}

/**
 * Interface for ImageViewerComponent's "data"
 *
 * @property prefixUrl (optional) Prepends the prefixUrl to navImages paths.
 * Default is //openseadragon.github.io/openseadragon/images/
 * @property classes (optional)
 * @property viewerWidth (optional)
 * @property viewerHeight (optional)
 * @property images (required)
 * @property viewerId (required) The id to assign to the imageviewer container
 * @property libOptions (required)
 */
export interface ImageViewerData {
  /* viewer icon's directory path */
  prefixUrl?: string;
  classes?: string;
  viewerWidth?: number;
  viewerHeight?: number;
  images: ImageData[] | string;
  viewerId: string;
  hideNavigation?: boolean;
  /* for a list of options view the official openseadragon documentation http://openseadragon.github.io/docs/OpenSeadragon.html#.Options */
  libOptions: any;
  /* A method returning the library instance */
  _setViewer: any;
}

@Component({
  selector: 'app-single-story',
  templateUrl: './single-story.component.html',
  styleUrls: ['./single-story.component.scss'],
})
export class SingleStoryComponent
  implements OnInit, OnDestroy, AfterContentChecked
{

  timelineActive = false;
  mapActive = false;
  viewerActive = true;
  updatedClient;
  loadedStory;
  loadedRelatedItems = [];
  defaultLang = 'it-IT';
  item: { id: number; title: string };
  paramsSubscription: Subscription;
  trustedDashboardUrl: SafeUrl;
  story: Story;
  id;
  sub;
  loading$ = this.loader.loading$;

  geoNamesList = [];

  isDataAvailable = false;

  tilesData: any = {
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

  data: any = {
    images: [],
    viewerId: 'seadragon-viewer',
    hideNavigation: false,
    libOptions: {
      /* SHOW GROUP */
      showNavigator: false, // shows the mini-map
      autoHideControls: false,

      /* SHOW BUTTONS */
      showRotationControl: false,
      showSequenceControl: true,
      showHomeControl: true,
      showZoomControl: true,
      // showNavigationControl: false,

      /* SEQUENCE */
      sequenceMode: true, // allows having multiple images (as in array of images + zoomed image)
      navigationControlAnchor: 'TOP_RIGHT',
    },

    _setViewer: (viewer) => viewer,
  };

  timeline_json = {
    events: [],
  };
  options = {
    debug: true,
    // height: 0,
    // width: 0,
    // hash_bookmark: true,
  };

  timeline;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storyService: StoryService,
    private http: HttpClient,
    public loader: LoadingService,
    private sanitizer: DomSanitizer
  ) {}

  @Input() emit: any;

  private _viewerLoaded = false;
  private _mapLoaded = false;

  switchView(view) {
    if (view == "mapviewer") {
      this.timelineActive = false;
      this.viewerActive = false;
      this.mapActive = true;
      setTimeout((tilesData) => {
        tilesData.instance.invalidateSize();
      }, 300, this.tilesData);
    } else if (view == "imgviewer") {
      this.timelineActive = false;
      this.mapActive = false;
      this.viewerActive = true;
    } else if (view == "timelineviewer") {
      this.timelineActive = true;
      this.mapActive = false;
      this.viewerActive = false;
    }
  }

  fetchStory() {
    this.http
      .get(`http://137.204.168.14/lib/api/item_sets`)
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
      .subscribe((item) => {
        item.map((i) => {
          if (i['o:id'] === +this.id) {
            this.loadedStory = i;
            this.fetchRelatedItems(this.loadedStory['dcterms:relation']);
            
            // console.log(this.timeline_json);
            // this.loadedStory = this.createDataModel(i);
            // this.loadedStory = parser.parseMedia(i);
            // this.setImages(this.loadedStory);
            console.log(i);
          }
        });
        console.log(this.loadedRelatedItems);
      });
  }

  fetchRelatedItems(items) {
    const promises = items.map((item) => this.http.get(item['@id']).toPromise());
    Promise.all(promises).then(async (res) => {
      for (let i = 0; i < res.length; i++) {
        const data = res[i];
        console.log({data});
        const relatedRes = parser.parseMedia(data);
        this.setImages(relatedRes);
        this.createDataModel(relatedRes);
        this.loadedRelatedItems.push(relatedRes);
      }
      this._loadMap();
      console.log(this.loadedRelatedItems);
      this.buildTimeline(this.loadedRelatedItems);
    });
  }

  buildTimeline(arr) {
    const searchValue = (item) => {
      for (let field of item) {
        return field['@value'] || field['o:label'];
      }
    };
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      let mediaURL = item.video_source && item.video_source.length ? item.video_source : item.thumbnail_display_urls.large;
      const timeline_item = {
        media: {
          url: mediaURL, // FIXME: undefined
          credit: searchValue(item['dcterms:creator']),
        },
        start_date: {
          year: searchValue(item['dcterms:date']).toString().includes('-') ? searchValue(item['dcterms:date']).toString().split('-')[0] : searchValue(item['dcterms:date']),
        },
        end_date: {
          year: searchValue(item['dcterms:date']).toString().includes('-') ? searchValue(item['dcterms:date']).toString().split('-')[1] : '',
        },
        text: {
          headline: `<a
                href="work/${item['o:id']}/timeline">${item['o:title']}</a>`,
          text: item['dcterms:description']
            ? '<p>' + searchValue(item['dcterms:description']) + '</p>'
            : null,
        },
      };
      this.timeline_json.events.push(timeline_item);      
    }
    console.log(this.timeline_json);
    new Timeline('timeline-embed', this.timeline_json, this.options);
  }
  setImages(item) {
    if (item.thumbnail_display_urls.large) {
      const promises = item['o:media'].map((uri) => {
        return this.http.get(uri['@id']).toPromise();
      });
      Promise.all(promises).then((res) => {
        for (let i = 0; i < res.length; i++) {
          const responseData = res[i];
          this.data.images.push({
            type: 'image',
            url: responseData['o:original_url'],
            buildPyramid: false,
          });
        }
        console.log("we're done");
        this._openseadragon();
      });
    }
  }

  peopleEntities = [];

  createDataModel(item) {
    // FIXME: move to parser?
    let lang = this.defaultLang;
    const dataModel = {
      creator: [],
      publisher: [],
      contributor: [],
      title: '',
      date: '',
      description: [],
      spatial: {
        label: '',
        lat: null,
        lng: null,
      },
      format: '',
      extent: '',
      place: [],
      subject: [],
      type: [],
      rights: [],
      identifier: '',
      citation: [],
    };

    Object.keys(item).map((property) => {
      // console.log(item[property]);
      switch (property) {
        case 'dcterms:format':
          dataModel.format = item[property][0]['@value'];
          break;

        case 'dcterms:extent':
          dataModel.extent = item[property][0]['@value'];
          break;

        case 'dcterms:identifier':
          dataModel.identifier = item[property][0]['@value'];
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
                            this.tilesData.markers.push({
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
        case 'dcterms:rights':
          item[property].map((hit) => {
            // if (hit.type === 'literal' && hit['@language']) {
            // if (hit['@language'] === lang) {
            //   dataModel.creator.push(hit['@value'])
            // }
            if (hit.type === 'uri') {
              // if (hit['@language'] === lang) {
              dataModel.rights.push({
                label: hit['o:label'],
                link: hit['@id'],
              });
              // }
            }
            // }
          });
          break;

        case 'dcterms:creator':
          item[property].map((hit) => {
            // if (hit.type === 'literal' && hit['@language']) {
            // if (hit['@language'] === lang) {
            //   dataModel.creator.push(hit['@value'])
            // }
            if (hit.type === 'uri') {
              // if (hit['@language'] === lang) {
              this.peopleEntities.push({
                label: hit['o:label'],
                link: hit['@id'],
              });
              // }
            }
            // }
          });
          break;

        case 'dcterms:publisher':
          item[property].map((hit) => {
            // if (hit.type === 'literal' && hit['@language']) {
            // if (hit['@language'] === lang) {
            //   dataModel.creator.push(hit['@value'])
            // }
            if (hit.type === 'uri') {
              // if (hit['@language'] === lang) {
                this.peopleEntities.push({
                label: hit['o:label'],
                link: hit['@id'],
              });
              // }
            }
            // }
          });
          break;

        case 'dcterms:contributor':
          item[property].map((hit) => {
            // if (hit.type === 'literal' && hit['@language']) {
            // if (hit['@language'] === lang) {
            //   dataModel.creator.push(hit['@value'])
            // }
            if (hit.type === 'uri') {
              // if (hit['@language'] === lang) {
                this.peopleEntities.push({
                label: hit['o:label'],
                link: hit['@id'],
              });
              // }
            }
            // }
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
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      console.log(params);
      this.id = params.get('id');
      let stories = this.storyService.getStories();
      this.story = stories.find((p) => p.id == this.id);
    });

    this.item = {
      id: this.route.snapshot.params['id'],
      title: this.route.snapshot.params['title'],
    };
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.item.id = params['id']; //+
      this.item.title = params['title'];
    });

    this.fetchStory();
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.sub.unsubscribe();
  }

  // timeout = 0;

   /** Dynamically load required node modules */
   private loadModules = async () => ({
    leaflet: await import('leaflet'),
    cluster: await import('leaflet.markercluster'),
  });

  public markerOpen$: Subject<object> = new Subject();
  public markerClose$: Subject<void> = new Subject();

  _openseadragon() {
    if (!this.data || this._viewerLoaded) return;
    this._viewerLoaded = true;

    setTimeout(() => {
      const prefixUrl = !this.data.prefixUrl
        ? '//openseadragon.github.io/openseadragon/images/'
        : this.data.prefixUrl;
      import('openseadragon').then((module) => {
        const openseadragon: any = module;
        // console.log(openseadragon);
        const viewer = openseadragon({
          id: this.data.viewerId,
          prefixUrl,
          tileSources: this.data.images,
          sequenceMode: true,
          showReferenceStrip: true,
          showSequenceControl: true,
          // zoomInButton: 'n7-image-viewer-zoom-in',
          // zoomOutButton: 'n7-image-viewer-zoom-out',
          // homeButton: 'n7-image-viewer-home',
          // fullPageButton: 'n7-image-viewer-full-screen',
          // nextButton: 'n7-image-viewer-nav-next',
          // previousButton: 'n7-image-viewer-nav-prev',
          ...this.data.libOptions,
        });

        this.data._setViewer(viewer);
      });
    }, 4000);
  }

  _loadMap() {
    if (!this.tilesData || this._mapLoaded) return;
    this._mapLoaded = true;
    setTimeout(() => {
      this.loadModules().then((modules) => {
        /** Module definitions */
        const lflet: any = modules.leaflet;
        const clstr: any = modules.cluster;
        // Merge cluster and leaflet into leaflet
        const leaflet = { ...lflet, ...clstr };
        // Create a map
        const { center, zoom } = this.tilesData.initialView;
        const map = leaflet
          .map(this.tilesData.containerId, this.tilesData.libOptions)
          .setView(center, zoom);
        this.tilesData.tileLayers.forEach((layer) => {
          leaflet.tileLayer(layer.url, layer.options).addTo(map);
        });
        /** Handle events */
        // map.on('click', this.onMapClick);
        /** Handle markers */
        if (this.tilesData.markers) {
          const markers = leaflet.markerClusterGroup(
            this.tilesData.clusterLibOptions
          );
          this.tilesData.markers.forEach((mrk) => {
            leaflet
              .marker(mrk.coords, { icon: this.MARKER_ICON })
              .addTo(markers)
              .bindPopup(mrk.template);
          });
          map.addLayer(markers);
          if (this.tilesData._setMarkerLayer) this.tilesData._setMarkerLayer(markers);
        }
        // Assign the map instance
        this.tilesData.instance = map;
        if (this.tilesData._setInstance) this.tilesData._setInstance(map);
      });
    }, 2500);
  }

  ngAfterContentChecked() {}

  onClick(payload) {
    if (!this.emit) return;
    this.emit('thumbclick', payload);
  }
}
