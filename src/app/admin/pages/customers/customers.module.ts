import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import {MaterialModule} from '../../../material/material.module';
import {FlexModule} from '@angular/flex-layout';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {CustomerEditDialogComponent} from './customer-edit-dialog/customer-edit-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CustomerDetailsComponent} from './customer-details/customer-details.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerEditDialogComponent,
    CustomerDetailsComponent
  ],
    imports: [
        CommonModule,
        CustomersRoutingModule,
        MaterialModule,
        FlexModule,
        NgxPaginationModule,
        NgxSpinnerModule,
        ReactiveFormsModule,
        PipesModule,
        FormsModule
    ]
})
export class CustomersModule { }
