
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MaterialModule} from '../../material/material.module';
import {AfterSalesSupportComponent} from './after-sales-support.component';
import {AfterSalesSupportRoutingModule} from './after-sales-support-routing.module';


@NgModule({
  declarations: [
    AfterSalesSupportComponent
  ],
    imports: [
        CommonModule,
        AfterSalesSupportRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class AfterSalesSupportModule { }
