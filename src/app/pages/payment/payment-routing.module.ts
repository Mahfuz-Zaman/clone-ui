import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PaymentComponent} from './payment.component';
import {PaymentSuccessComponent} from './payment-success/payment-success.component';
import {PaymentCancelComponent} from './payment-cancel/payment-cancel.component';
import {PaymentFailComponent} from './payment-fail/payment-fail.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentComponent,
    children: [
      {path: '', redirectTo: 'success'},
      {path: 'success', component: PaymentSuccessComponent},
      {path: 'cancel', component: PaymentCancelComponent},
      {path: 'fail', component: PaymentFailComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
