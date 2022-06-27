import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StoryComponent } from './story/story.component';
import { LibraryComponent } from './library/library.component';
import { WorkComponent } from './work/work.component';
import { SingleWorkComponent } from './single-work/single-work.component';
import { TimelineComponent } from './timeline/timeline.component';
import { CreditsComponent } from './credits/credits.component';

const routes: Routes = [
  { path: 'library', component: LibraryComponent },
  { path: 'credits', component: CreditsComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'story', component: StoryComponent },
  { path: 'work', component: WorkComponent },
  { path: 'home', component: HomeComponent},
  { path: 'work/:id/:title', component: SingleWorkComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
