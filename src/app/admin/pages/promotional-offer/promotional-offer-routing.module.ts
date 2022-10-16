import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PromotionalOfferComponent} from './promotional-offer.component';
import {AddPromotionalOfferComponent} from './add-promotional-offer/add-promotional-offer.component';

const routes: Routes = [
  {path: '', component: PromotionalOfferComponent},
  {path: 'add-promotional-offer', component: AddPromotionalOfferComponent},
  {path: 'edit-promotional-offer/:id', component: AddPromotionalOfferComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromotionalOfferRoutingModule { }
