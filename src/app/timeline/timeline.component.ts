import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  timeline: {
    "events": [
      {
        "media": {
          "url": "", // video_source || original_url
          "caption": "",
          "credit": ""
        },
        "start_date": {
          "year"  // dcterms:date
        },
        "text": {
          "headline": "" // o:title
          "text": "<p></p>" // dcterms:description
        }
      }
    ]
  }

  
}
