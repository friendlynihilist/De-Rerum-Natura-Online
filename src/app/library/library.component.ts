import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ITS_JUST_ANGULAR } from '@angular/core/src/r3_symbols';
import { bootstrap } from 'bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TextSelectorService } from '../text-selector.service';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; // optional for styling
// import OpenSeadragon = require("openseadragon")
// import { XDomPath } from '@telenko/xdompath/src';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit, AfterViewInit {
  subscription: Subscription;
  updae;

  constructor(
    private textSelector: TextSelectorService,
    private router: Router
  ) {
    // this.isLoading = true;
    // this.checkIfLoaded();
  }

  isLoading: boolean;

  ngOnInit(): void {
    // this.subscription = this.textSelector.customerUpdate$.subscribe(
    //   (updatedClientData) => {
    //     console.log(updatedClientData);
    //     this.delayHighlight(updatedClientData);
    //   }
    // );
    // this.textSelector.customerUpdate$ = undefined;
    //     var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    // var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    //   return new bootstrap.Popover(popoverTriggerEl)
    // })
  }

  ngAfterViewInit() {
    // this.isLoading = false;
    // this.subscription = this.textSelector.customerUpdate$.subscribe(
    //   (updatedClientData) => {
    //     this.highlight(updatedClientData);
    //   }
    // );
    // this.textSelector.customerUpdate$ = undefined;
  }

  checkIfLoaded() {
    // window.addEventListener('load', function (event) {
    //   console.log('All resources finished loading!');
    // });
  }

  highlight(item) {
    if (typeof item !== null || undefined) {
      let view = document.querySelector('pb-view#view1');
      let shadow = view.shadowRoot;
      let allL = shadow.querySelectorAll('div.tei-l');
      function nodeListToString(nodeList) {
        return [].slice.call(nodeList).reduce((str, x) => {
          return (str += x.outerHTML);
        }, '');
      }

      let string = nodeListToString(allL);
      let xmlString = '<div>' + string + '</div>';
      let parser = new DOMParser();
      let xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      let evaluate = document.evaluate(
        item,
        xmlDoc,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE,
        null
      );

      while (evaluate.iterateNext !== null) {
        let node = evaluate.iterateNext();
        console.log(node);
        for (let i = 0; i < allL.length; i++) {
          let nodeText = node.nodeValue; // FIXME: returns null on last cycle
          let divH = <HTMLElement>allL[i];
          if (divH.innerHTML === nodeText) {
            divH.style.display = 'inline';
            divH.style.borderBottom = '2px dotted #2481dc85';
          }
        }
      }
    }
  }

  delayHighlight(item) {
    setTimeout(function highlight() {
      if (typeof item !== null || undefined) {
        let view = document.querySelector('pb-view#view1');
        let shadow = view.shadowRoot;
        let allL = shadow.querySelectorAll('div.tei-l');
        function nodeListToString(nodeList) {
          return [].slice.call(nodeList).reduce((str, x) => {
            return (str += x.outerHTML);
          }, '');
        }

        let string = nodeListToString(allL);
        let xmlString = '<div>' + string + '</div>';
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        let evaluate = document.evaluate(
          item,
          xmlDoc,
          null,
          XPathResult.ORDERED_NODE_ITERATOR_TYPE,
          null
        );

        while (evaluate.iterateNext !== null) {
          //FIXME
          let node = evaluate.iterateNext();
          console.log(node); //FIXME
          for (let i = 0; i < allL.length; i++) {
            let nodeText = node.nodeValue; // FIXME: returns null on last cycle
            let divH = <HTMLElement>allL[i];
            if (divH.innerHTML === nodeText) {
              divH.style.display = 'inline';
              divH.style.borderBottom = '2px dotted #2481dc85';
              let inner = divH.innerText;
              divH.innerHTML = `<a href="http://localhost:4200/work/7/natura-decomposta" id="text-reference-${i}">
              ${inner}
            </a>`;
              let reference = shadow.getElementById(`text-reference-${i}`);
              reference.style.textDecoration = 'none';
              reference.style.color = '#333333';
              tippy(reference, {
                theme: 'light',
                content: `<img style="width:100%" src="https://137.204.168.14/lib/files/large/c03cfc0843862a6b1ff72f73954d47cfefe2fe0d.jpg"></img><span>Natura decomposta</span>`,
                allowHTML: true,
                // interactive: true,
              });
              // new bootstrap.Popover(shadow.querySelector('.example-popover'), {
              //   container: 'body'
              // })
              // let popoverTriggerList = [].slice.call(
              //   shadow.querySelectorAll('[data-bs-toggle="popover"]')
              // );
              // var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
              //   return new bootstrap.Popover(popoverTriggerEl);
              // });
              // $('[data-toggle="popover"]').popover();
              // new bootstrap.Popover(divH);
              // new bootstrap.Tooltip(divH, {
              //   boundary: ShadowRoot
              //   })
            }
          }
        }
      }
    }, 2000);
  }

  //

  myTitle = 'project-angular'; //FIXME: remove this
  open = false; //FIXME: remove this

  toggle(event) {
    //FIXME: remove this
    console.log(event);
    this.open = event.detail;
  }

  goTo() {
    //FIXME: fix routing
    this.router.navigate(['work', '7', 'natura-decomposta']);
  }
}
