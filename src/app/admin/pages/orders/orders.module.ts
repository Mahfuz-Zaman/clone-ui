import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import {ExtendedModule, FlexModule} from '@angular/flex-layout';
import {MaterialModule} from '../../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import { OrderDetailsComponent } from './order-details/order-details.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {UpdateCheckboxOrderStatusModule} from '../../../shared/dialog-view/update-checkbox-order-status/update-checkbox-order-status.module'
import {UpdateOrderStatusModule} from '../../../shared/dialog-view/update-order-status/update-order-status.module';
import {UpdateOrderStatusComponent} from './update-order-status/update-order-status.component';

@NgModule({
  declarations: [
    OrdersComponent,
    OrderDetailsComponent,
    UpdateOrderStatusComponent
  ],
    imports: [
        CommonModule,
        OrdersRoutingModule,
        FlexModule,
        MaterialModule,
        NgxPaginationModule,
        NgxSpinnerModule,
        PipesModule,
        ReactiveFormsModule,
        FormsModule,
        ExtendedModule,
        SharedModule,
        UpdateCheckboxOrderStatusModule,
        UpdateOrderStatusModule
    ]
})
export class OrdersModule { }
