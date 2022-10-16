import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ImageGalleryDialogComponent} from './image-gallery-dialog.component';
import {UploadImageComponent} from './upload-image/upload-image.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxDropzoneModule} from 'ngx-dropzone';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    ImageGalleryDialogComponent,
    UploadImageComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxPaginationModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class ImageGalleryDialogModule {
}
