import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StoryComponent } from './story/story.component';
import { LibraryComponent } from './library/library.component';
import { WorkComponent } from './work/work.component';
import { SingleWorkComponent } from './single-work/single-work.component';
import { SingleStoryComponent } from './single-story/single-story.component';
import { TimelineComponent } from './timeline/timeline.component';
import { CreditsComponent } from './credits/credits.component';
import { GraphComponent } from './graph/graph.component';
import { MapComponent } from './map/map.component';
import { CollectionComponent } from './collection/collection.component';

const routes: Routes = [
  { path: 'library', component: LibraryComponent },
  { path: 'collection', component: CollectionComponent},
  { path: 'credits', component: CreditsComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'story', component: StoryComponent },
  { path: 'work', component: WorkComponent },
  { path: 'graph', component: GraphComponent },
  { path: 'map', component: MapComponent },
  { path: 'home', component: HomeComponent},
  { path: 'work/:id/:title', component: SingleWorkComponent},
  { path: 'story/:id/:title', component: SingleStoryComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
