import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealOnPlayRoutingModule } from './deal-on-play-routing.module';
import { DealOnPlayComponent } from './deal-on-play.component';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../material/material.module';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProductCardTwoModule} from '../../shared/lazy-component/product-card-two/product-card-two.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';


@NgModule({
  declarations: [
    DealOnPlayComponent
  ],
  imports: [
    CommonModule,
    DealOnPlayRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    ProductCardTwoModule,
    ProductCardOneModule,
  ]
})
export class DealOnPlayModule { }
