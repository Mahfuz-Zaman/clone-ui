import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageFolderRoutingModule} from './image-folder-routing.module';
import {ImageFolderComponent} from './image-folder.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddImageFolderComponent} from './add-image-folder/add-image-folder.component';


@NgModule({
  declarations: [
    ImageFolderComponent,
    AddImageFolderComponent
  ],
  imports: [
    CommonModule,
    ImageFolderRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ImageFolderModule {
}
