import { Component, OnInit } from '@angular/core';
// import OpenSeadragon = require("openseadragon")
// import { XDomPath } from '@telenko/xdompath/src';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }

  myTitle = 'project-angular';
  open = false;

  toggle(event) {
    console.log(event);
    this.open = event.detail;
  }

  highlight() {
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
      '//*/*[position()>2 and position()<8]/text()',
      xmlDoc,
      null,
      XPathResult.ORDERED_NODE_ITERATOR_TYPE,
      null
    );

    while(evaluate.iterateNext) {
      let node = evaluate.iterateNext();
      for (let i = 0; i < allL.length; i++) {
        let nodeText = node.nodeValue;
        let divH = <HTMLElement>allL[i];
        // console.log(`${nodeText} : ${allL[2].innerHTML}`);
        if (divH.innerHTML === nodeText) {
          //nodeText
          // console.log('match');
          divH.style.display = 'block';
          divH.style.backgroundColor = 'yellow';
        }
      }
    }
  }

  data: {
    endpoint: 'http://staging.teipublisher.netseven.it/exist/apps/tei-publisher';
    docs: [
      {
        xml: 'petrarca/seniles_(1)_1606990092.xml';
        odd: 'test';
        // id: 'seniles',
      }
      // {
      //   xml: 'test/seniles.xml',
      //   odd: 'test',
      //   id: 'seniles2',
      //   channel: 'altrochannel',
      // },
    ];
  };
}
