import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {WarrantyDashboardComponent} from './warranty-dashboard.component';
import {AddNewWarrantyComponent} from './add-new-warranty/add-new-warranty.component';
import {WarrantyDashboardRoutingModule} from './warranty-dashboard-routing.module';


@NgModule({
  declarations: [
    WarrantyDashboardComponent,
    AddNewWarrantyComponent
  ],
    imports: [
        CommonModule,
        WarrantyDashboardRoutingModule,
        MaterialModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxSpinnerModule,
        NgxPaginationModule
    ]
})
export class WarrantyDashboardModule { }
