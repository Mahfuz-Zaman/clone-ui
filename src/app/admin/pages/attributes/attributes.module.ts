import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AttributesRoutingModule} from './attributes-routing.module';
import {AttributesComponent} from './attributes.component';
import {MaterialModule} from '../../../material/material.module';
import {AddNewAttributeComponent} from './add-new-attribute/add-new-attribute.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {DownloadJsonDialogModule} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.module';


@NgModule({
  declarations: [
    AttributesComponent,
    AddNewAttributeComponent
  ],
  imports: [
    CommonModule,
    AttributesRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FormsModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    DownloadJsonDialogModule
  ]
})
export class AttributesModule {
}
