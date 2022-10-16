import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TagsRoutingModule } from './tags-routing.module';
import { TagsComponent } from './tags.component';
import { AddNewTagComponent } from './add-new-tag/add-new-tag.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    TagsComponent,
    AddNewTagComponent
  ],
    imports: [
        CommonModule,
        TagsRoutingModule,
        MaterialModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxSpinnerModule,
        NgxPaginationModule
    ]
})
export class TagsModule { }
