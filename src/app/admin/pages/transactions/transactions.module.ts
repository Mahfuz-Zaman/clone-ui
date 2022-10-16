import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionsRoutingModule } from './transactions-routing.module';
import { TransactionsComponent } from './transactions.component';
import {MaterialModule} from '../../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    TransactionsComponent
  ],
    imports: [
        CommonModule,
        TransactionsRoutingModule,
        MaterialModule,
        NgxPaginationModule,
        NgxSpinnerModule,
        FlexModule,
        PipesModule
    ]
})
export class TransactionsModule { }
