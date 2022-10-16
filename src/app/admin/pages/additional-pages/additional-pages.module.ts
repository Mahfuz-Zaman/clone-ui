import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { AdditionalPagesComponent } from './additional-pages.component';
import { ViewPageComponent } from './view-page/view-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxEditorModule} from 'ngx-editor';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from '../../../material/material.module';
import {AngularEditorModule} from '@kolkov/angular-editor';


const routes: Routes = [
  {path: '', component: AdditionalPagesComponent},
  {path: 'view/:pageSlug', component: ViewPageComponent},
];

@NgModule({
  declarations: [
    AdditionalPagesComponent,
    ViewPageComponent
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        NgxEditorModule,
        FlexLayoutModule,
        MaterialModule,
        AngularEditorModule,
    ]
})
export class AdditionalPagesModule {
}
