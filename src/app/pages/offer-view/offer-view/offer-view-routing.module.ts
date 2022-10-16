import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OfferViewComponent} from './offer-view.component';

const routes: Routes = [
  {path: ':slug', component: OfferViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferViewRoutingModule { }
