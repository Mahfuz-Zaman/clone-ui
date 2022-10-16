import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculateCoolingCapacityComponent } from './calculate-cooling-capacity.component';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DigitOnlyModule} from "@uiowa/digit-only";
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '../../shared.module';


@NgModule({
  declarations: [
    CalculateCoolingCapacityComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    DigitOnlyModule,
    FormsModule,
    MatFormFieldModule,
    SharedModule

  ],
  exports: [
    CalculateCoolingCapacityComponent
  ]
})
export class CalculateCoolingCapacityModule { }
