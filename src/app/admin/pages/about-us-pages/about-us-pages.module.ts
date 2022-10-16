import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutUsPagesRoutingModule } from './about-us-pages-routing.module';
import { AboutUsPagesComponent } from './about-us-pages.component';
import { AddAboutUsPagesComponent } from './add-about-us-pages/add-about-us-pages.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [
    AboutUsPagesComponent,
    AddAboutUsPagesComponent
  ],
  imports: [
    CommonModule,
    AboutUsPagesRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    SharedModule
  ]
})
export class AboutUsPagesModule { }
