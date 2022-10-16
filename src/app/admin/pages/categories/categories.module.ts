import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { AddNewCategoryComponent } from './add-new-category/add-new-category.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {NgxPaginationModule} from 'ngx-pagination';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxEditorModule } from 'ngx-editor';


@NgModule({
  declarations: [
    CategoriesComponent,
    AddNewCategoryComponent
  ],
    imports: [
        CommonModule,
        CategoriesRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatProgressSpinnerModule,
        FormsModule,
        NgxSpinnerModule,
        DigitOnlyModule,
        PipesModule,
        NgxPaginationModule,
        AngularEditorModule,
        NgxEditorModule,
    ]
})
export class CategoriesModule { }
