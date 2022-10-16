import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductListBannerRoutingModule } from './product-list-banner-routing.module';
import { ProductListBannerComponent } from './product-list-banner.component';
import {MaterialModule} from '../../../material/material.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import { AddProductListBannerComponent } from './add-product-list-banner/add-product-list-banner.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {FlexModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    ProductListBannerComponent,
    AddProductListBannerComponent
  ],
    imports: [
        CommonModule,
        ProductListBannerRoutingModule,
        MaterialModule,
        NgxSpinnerModule,
        FormsModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        AngularEditorModule,
        FlexModule
    ]
})
export class ProductListBannerModule { }
