import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DealOnPlayComponent} from './deal-on-play.component';

const routes: Routes = [
  // {path: ':id', component: DealOnPlayComponent}
  {path: ':slug', component: DealOnPlayComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealOnPlayRoutingModule { }
