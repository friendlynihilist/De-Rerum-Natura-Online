import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WorkComponent } from './work/work.component';
import { LibraryComponent } from './library/library.component';
import { HomeComponent } from './home/home.component';
import { StoryComponent } from './story/story.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SingleWorkComponent } from './single-work/single-work.component';
import { TimelineComponent } from './timeline/timeline.component';
// import { JwPaginationComponent } from 'jw-angular-pagination';

@NgModule({
  declarations: [
    AppComponent,
    WorkComponent,
    LibraryComponent,
    HomeComponent,
    StoryComponent,
    SingleWorkComponent,
    TimelineComponent,
    // JwPaginationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }