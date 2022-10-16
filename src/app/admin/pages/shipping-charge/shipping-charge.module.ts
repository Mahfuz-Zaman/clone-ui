import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingChargeRoutingModule } from './shipping-charge-routing.module';
import { ShippingChargeComponent } from './shipping-charge.component';
import {TagsRoutingModule} from '../tags/tags-routing.module';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    ShippingChargeComponent
  ],
  imports: [
    CommonModule,
    ShippingChargeRoutingModule,
    TagsRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class ShippingChargeModule { }
