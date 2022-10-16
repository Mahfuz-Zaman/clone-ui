import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { AddBlogComponent } from './add-blog/add-blog.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {SharedModule} from '../../../shared/shared.module';
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
  declarations: [
    BlogComponent,
    AddBlogComponent
  ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        MaterialModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        AngularEditorModule,
        SharedModule,
        DigitOnlyModule
    ]
})
export class BlogModule { }
