import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealsOfTheDayRoutingModule } from './deals-of-the-day-routing.module';
import { DealsOfTheDayComponent } from './deals-of-the-day.component';
import { AddNewDealsOfTheDayComponent } from './add-new-deals-of-the-day/add-new-deals-of-the-day.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {DigitOnlyModule} from '@uiowa/digit-only';
import {NgxEditorModule} from 'ngx-editor';
import {AngularEditorModule} from '@kolkov/angular-editor';


@NgModule({
  declarations: [
    DealsOfTheDayComponent,
    AddNewDealsOfTheDayComponent
  ],
    imports: [
        CommonModule,
        DealsOfTheDayRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexModule,
        FormsModule,
        PipesModule,
        DigitOnlyModule,
        NgxEditorModule,
        AngularEditorModule
    ]
})
export class DealsOfTheDayModule { }
