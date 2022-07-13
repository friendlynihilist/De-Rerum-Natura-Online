import { Component, OnInit, NgZone, Input, AfterContentChecked } from '@angular/core';
import OpenSeadragon from 'openseadragon';

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
  type: 'image' | 'zoomifytileservice' | 'openstreetmaps' | 'tiledmapservice' | 'legacy-image-pyramid';
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
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit, AfterContentChecked {
  constructor() {}

  // @Input() data: ImageViewerData;

  @Input() emit: any;

  private _loaded = false;

  data: ImageViewerData = {
    images: [
      { type: 'image', url: 'http://placekitten.com/1920/1080', buildPyramid: false },
      { type: 'image', url: 'http://placekitten.com/500/600', buildPyramid: false },
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

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    if (!this.data || this._loaded) return;
    this._loaded = true;

    setTimeout(() => {
      const prefixUrl = !this.data.prefixUrl ? '//openseadragon.github.io/openseadragon/images/' : this.data.prefixUrl;
      import('openseadragon').then((module) => {
        const openseadragon: any = module;
        console.log(openseadragon);
        const viewer = openseadragon({
          id: this.data.viewerId,
          prefixUrl,
          tileSources: this.data.images,
          // zoomInButton: 'n7-image-viewer-zoom-in',
          // zoomOutButton: 'n7-image-viewer-zoom-out',
          // homeButton: 'n7-image-viewer-home',
          // fullPageButton: 'n7-image-viewer-full-screen',
          // nextButton: 'n7-image-viewer-nav-next',
          // previousButton: 'n7-image-viewer-nav-prev',
          ...this.data.libOptions
        });

        this.data._setViewer(viewer);
      });
    });
  }

  onClick(payload) {
    if (!this.emit) return;
    this.emit('thumbclick', payload);
  }
}
