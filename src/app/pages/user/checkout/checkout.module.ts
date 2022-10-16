import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CheckoutRoutingModule} from './checkout-routing.module';
import {CheckoutComponent} from './checkout.component';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {ConfirmOrderDialogComponent} from './confirm-order-dialog/confirm-order-dialog.component';
import {AddNewAddressModule} from '../../../shared/dialog-view/add-new-address/add-new-address.module';


@NgModule({
  declarations: [
    CheckoutComponent,
    ConfirmOrderDialogComponent
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    PipesModule,
    FormsModule,
    AddNewAddressModule
  ]
})
export class CheckoutModule { }
