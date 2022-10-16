import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OfferProductComponent} from './offer-product.component';
import {AddOfferProductComponent} from './add-offer-product/add-offer-product.component';

const routes: Routes = [
  {path: '', component: OfferProductComponent},
  {path: 'add-offer-product', component: AddOfferProductComponent},
  {path: 'edit-offer-product/:id', component: AddOfferProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferProductRoutingModule { }
