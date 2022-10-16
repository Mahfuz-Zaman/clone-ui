import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { PaymentFailComponent } from './payment-fail/payment-fail.component';
import {MaterialModule} from '../../material/material.module';


@NgModule({
  declarations: [
    PaymentComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
    PaymentFailComponent
  ],
    imports: [
        CommonModule,
        PaymentRoutingModule,
        MaterialModule
    ]
})
export class PaymentModule { }
