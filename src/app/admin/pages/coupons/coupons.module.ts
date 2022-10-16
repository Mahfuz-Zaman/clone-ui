import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponsRoutingModule } from './coupons-routing.module';
import { CouponsComponent } from './coupons.component';
import { AddCouponComponent } from './add-coupon/add-coupon.component';
import {MaterialModule} from '../../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {DigitOnlyModule} from '@uiowa/digit-only';


@NgModule({
  declarations: [
    CouponsComponent,
    AddCouponComponent
  ],
    imports: [
        CommonModule,
        CouponsRoutingModule,
        MaterialModule,
        NgxPaginationModule,
        NgxSpinnerModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        FlexModule,
        DigitOnlyModule
    ]
})
export class CouponsModule { }
