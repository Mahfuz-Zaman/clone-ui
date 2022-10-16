import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DiscussionComponent} from './discussion.component';
import {ReplyDiscussionComponent} from './reply-discussion/reply-discussion.component';

const routes: Routes = [
  {path: '', component: DiscussionComponent},
  {path: 'reply-discussion/:id', component: ReplyDiscussionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiscussionRoutingModule { }
