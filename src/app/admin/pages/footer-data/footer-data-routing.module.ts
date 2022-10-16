import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FooterDataComponent} from './footer-data.component';

const routes: Routes = [
  {path: '', component: FooterDataComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FooterDataRoutingModule { }
