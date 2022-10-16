import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AddProductRoutingModule} from './add-product-routing.module';
import {AddProductComponent} from './add-product.component';
import {MaterialModule} from '../../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxEditorModule} from 'ngx-editor';
import {NgxSpinnerModule} from 'ngx-spinner';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {ImageGalleryDialogModule} from '../../image-gallery-dialog/image-gallery-dialog.module';
import {MatSelectFilterModule} from 'mat-select-filter';


@NgModule({
  declarations: [
    AddProductComponent
  ],
  imports: [
    CommonModule,
    AddProductRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FormsModule,
    NgxSpinnerModule,
    DigitOnlyModule,
    AngularEditorModule,
    ImageGalleryDialogModule,
    MatSelectFilterModule
  ]
})
export class AddProductModule {
}
