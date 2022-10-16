import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareerEsquireRoutingModule } from './career-esquire-routing.module';
import { CareerEsquireComponent } from './career-esquire.component';
import { AddCareerEsquireComponent } from './add-career-esquire/add-career-esquire.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {FlexModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {NgxSpinnerModule} from 'ngx-spinner';
import {MatInputModule} from '@angular/material/input';
import {DigitOnlyModule} from "@uiowa/digit-only";


@NgModule({
  declarations: [
    CareerEsquireComponent,
    AddCareerEsquireComponent
  ],
    imports: [
        CommonModule,
        CareerEsquireRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatCheckboxModule,
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        FlexModule,
        MatFormFieldModule,
        AngularEditorModule,
        NgxSpinnerModule,
        MatInputModule,
        DigitOnlyModule
    ]
})
export class CareerEsquireModule { }
