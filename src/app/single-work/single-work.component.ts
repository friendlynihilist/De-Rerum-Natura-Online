import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  AfterContentChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { WorkService } from '../work/work.service';
import { Work } from '../work/work';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { parser } from '../parsers';
import { TextSelectorService } from '../text-selector.service';
import * as N3 from 'n3';
import { DataFactory } from 'rdf-data-factory';
import { LoadingService } from '../loading.service';

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
  selector: 'app-single-work',
  templateUrl: './single-work.component.html',
  styleUrls: ['./single-work.component.scss'],
})
export class SingleWorkComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  updatedClient;
  loadedItem;
  defaultLang = 'it-IT';
  item: { id: number; title: string };
  paramsSubscription: Subscription;
  trustedDashboardUrl: SafeUrl;
  work: Work;
  id;
  sub;
  loading$ = this.loader.loading$;

  constructor(
    private textSelector: TextSelectorService,
    private route: ActivatedRoute,
    private router: Router,
    private workService: WorkService,
    private http: HttpClient,
    public loader: LoadingService,
    private sanitizer: DomSanitizer
  ) {}

  @Input() emit: any;

  private _loaded = false;

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
          item[property].map((hit) => {
            // if (hit.type === 'literal' && hit['@language']) {
            // if (hit['@language'] === lang) {
            //   dataModel.creator.push(hit['@value'])
            // }
            if (hit.type === 'uri') {
              // if (hit['@language'] === lang) {
              dataModel.place.push({
                label: hit['o:label'],
                link: hit['@id'],
              });
              // }
            }
            // }
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
              dataModel.creator.push({
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
              dataModel.publisher.push({
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
              dataModel.contributor.push({
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

  isArray(obj: any) {
    return Array.isArray(obj);
  }

  typeOf(obj: any) {
    return typeof obj;
  }

  translationParser(label) {
    const mapping = {
      'creator': 'autore',
      'contributor': 'collaboratore',
      'publisher': 'editore',
      'format': 'formato',
      'identifier': 'identificatore',
      'title': 'titolo originale',
      'date': 'anno',
      'place': 'luogo',
      'citation': 'riferimento bibliografico',
      'rights': 'diritti',
      'type': 'tipo',
      'subject': 'soggetto',
      'extent': 'misure'
    }

    return mapping[label].charAt(0).toUpperCase() + mapping[label].slice(1)
  }

  fetchItem() {
    this.http
      .get(`http://137.204.168.14/lib/api/items`)
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
            this.loadedItem = this.createDataModel(i);
            this.loadedItem = parser.parseMedia(i);
            this.setImages(this.loadedItem);
            console.log(i);
          }
        });
        // console.log(item);
      });
  }

  updateXPath() {
    this.updatedClient = this.loadedItem.has_xpath;
    this.textSelector.updatedCustomer(this.updatedClient);
  }

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      console.log(params);
      this.id = params.get('id');
      let works = this.workService.getWorks();
      this.work = works.find((p) => p.id == this.id);
    });

    this.item = {
      id: this.route.snapshot.params['id'],
      title: this.route.snapshot.params['title'],
    };
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.item.id = params['id']; //+
      this.item.title = params['title'];
    });

    this.fetchItem();
    // console.log(this.loadedItem);
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
    this.sub.unsubscribe();
  }

  isValid(string) {
    if (/dcterms/.test(string)) {
      return true;
    } else return false;
  }

  buildLink(obj) {
    let baseUrl = 'http://localhost:4200';
    return `${baseUrl}/work/${obj['value_resource_id']}/${parser.slugify(
      obj['display_title']
    )}`;
  }

  setImages(item) {
    if (item.thumbnail_display_urls.large) {
      item['o:media'].map((uri) => {
        this.http.get(uri['@id']).subscribe((responseData) => {
          this.data.images.push({
            type: 'image',
            url: responseData['o:original_url'],
            buildPyramid: false,
          });
        });
      });
      // this.data.images.push({
      //   type: 'image',
      //   url: item.thumbnail_display_urls.large,
      //   buildPyramid: false
      // })
    }
    // for (let image of item['original_url']) {
    //   console.log(image);
    // }
  }

  data: any = {
    images: [
      // {
      //   type: 'image',
      //   url: 'http://placekitten.com/500/600',
      //   buildPyramid: false,
      // },
      // {
      //   type: 'image',
      //   url: 'http://placekitten.com/500/600',
      //   buildPyramid: false,
      // },
      // { type: 'image', url: 'http://placekitten.com/700/400', buildPyramid: false }
    ],
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

  timeout = 0;

  ngAfterContentChecked() {
    if (!this.loadedItem) {
      this.timeout = this.timeout + 2000;
    }
    if (!this.data || this._loaded) return;
    this._loaded = true;

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
    }, this.timeout);
  }

  onClick(payload) {
    if (!this.emit) return;
    this.emit('thumbclick', payload);
  }
}
