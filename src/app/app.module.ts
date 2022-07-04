import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
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
import { TextSelectorService } from './text-selector.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterModule, ROUTES, RoutesRecognized } from '@angular/router';
import { CreditsComponent } from './credits/credits.component';
import { GraphComponent } from './graph/graph.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    WorkComponent,
    LibraryComponent,
    HomeComponent,
    StoryComponent,
    SingleWorkComponent,
    TimelineComponent,
    CreditsComponent,
    GraphComponent,
    MapComponent,
    // JwPaginationComponent
  ],
  imports: [
    RouterModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CarouselModule,
    NgbModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [TextSelectorService],
  bootstrap: [AppComponent]
})
export class AppModule {
}