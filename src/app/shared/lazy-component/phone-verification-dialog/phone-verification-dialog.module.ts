import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneVerificationDialogComponent } from './phone-verification-dialog.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material.module';
import {PipesModule} from '../../pipes/pipes.module';
import {ExtendedModule} from '@angular/flex-layout';



@NgModule({
  declarations: [
    PhoneVerificationDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    PipesModule,
    ExtendedModule
  ],
  exports: [
    PhoneVerificationDialogComponent
  ]
})
export class PhoneVerificationDialogModule { }
