import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TextSelectorService } from '../text-selector.service';
// import OpenSeadragon = require("openseadragon")
// import { XDomPath } from '@telenko/xdompath/src';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  subscription: Subscription;

  constructor(
    private textSelector: TextSelectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.textSelector.customerUpdate$.subscribe(
      (updatedClientData) => {
        this.delayHighlight(updatedClientData);
      }
    );
    this.textSelector.customerUpdate$ = undefined;
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

        while (evaluate.iterateNext) {
          let node = evaluate.iterateNext();
          console.log(node);
          for (let i = 0; i < allL.length; i++) {
            let nodeText = node.nodeValue; // FIXME: returns null on last cycle
            let divH = <HTMLElement>allL[i];
            if (divH.innerHTML === nodeText) {
              divH.style.display = 'block';
              divH.style.backgroundColor = '#ffff003b';
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
