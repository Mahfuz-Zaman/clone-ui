import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShippingChargeComponent} from './shipping-charge.component';

const routes: Routes = [
  {
    path: '',
    component: ShippingChargeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingChargeRoutingModule { }
