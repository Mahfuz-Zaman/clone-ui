import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeaturedCategoryRoutingModule } from './featured-category-routing.module';
import { FeaturedCategoryComponent } from './featured-category.component';
import { AddNewFeaturedCategoryComponent } from './add-new-featured-category/add-new-featured-category.component';
import {MaterialModule} from '../../../material/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {DigitOnlyModule} from '@uiowa/digit-only';


@NgModule({
  declarations: [
    FeaturedCategoryComponent,
    AddNewFeaturedCategoryComponent
  ],
    imports: [
        CommonModule,
        FeaturedCategoryRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexModule,
        PipesModule,
        DigitOnlyModule
    ]
})
export class FeaturedCategoryModule { }
