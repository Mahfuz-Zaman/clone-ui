import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SellOnComponent} from './sell-on.component';

const routes: Routes = [
  {path: '', component: SellOnComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SellOnRoutingModule { }
