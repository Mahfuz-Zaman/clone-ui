import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromoPageRoutingModule } from './promo-page-routing.module';
import { PromoPageComponent } from './promo-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MaterialModule} from '../../../material/material.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [
    PromoPageComponent
  ],
  imports: [
    CommonModule,
    PromoPageRoutingModule,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatIconModule,
    MaterialModule,
    SharedModule
  ]
})
export class PromoPageModule { }
