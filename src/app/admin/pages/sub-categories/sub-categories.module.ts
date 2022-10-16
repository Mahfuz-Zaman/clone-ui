import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubCategoriesRoutingModule } from './sub-categories-routing.module';
import { SubCategoriesComponent } from './sub-categories.component';
import { AddNewSubCategoryComponent } from './add-new-sub-category/add-new-sub-category.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    SubCategoriesComponent,
    AddNewSubCategoryComponent
  ],
  imports: [
    CommonModule,
    SubCategoriesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    NgxPaginationModule,
    NgxSpinnerModule
  ]
})
export class SubCategoriesModule { }
