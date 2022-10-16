
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import {NgxSpinnerModule} from 'ngx-spinner';
import {SubmitComplaintComponent} from './submit-complaint.component';
import {MaterialModule} from '../../material/material.module';
import {SubmitComplaintRoutingModule} from './submit-complaint-routing.module';


@NgModule({
  declarations: [
    SubmitComplaintComponent
  ],
    imports: [
        CommonModule,
        SubmitComplaintRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        NgxSpinnerModule
    ]
})
export class SubmitComplaintModule { }
