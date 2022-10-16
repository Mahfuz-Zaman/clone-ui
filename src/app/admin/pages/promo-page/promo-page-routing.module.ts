import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PromoPageComponent} from './promo-page.component';

const routes: Routes = [
  {path: '', component: PromoPageComponent},
  {path: 'edit-promo-page/:id', component: PromoPageComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoPageRoutingModule { }
