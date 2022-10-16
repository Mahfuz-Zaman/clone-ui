import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturedProductRoutingModule } from './featured-product-routing.module';
import { FeaturedProductComponent } from './featured-product.component';
import { AddNewFeaturedProductComponent } from './add-new-featured-product/add-new-featured-product.component';
import {MaterialModule} from '../../../material/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {DigitOnlyModule} from '@uiowa/digit-only';


@NgModule({
  declarations: [
    FeaturedProductComponent,
    AddNewFeaturedProductComponent
  ],
    imports: [
        CommonModule,
        FeaturedProductRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexModule,
        PipesModule,
        DigitOnlyModule
    ]
})
export class FeaturedProductModule { }
