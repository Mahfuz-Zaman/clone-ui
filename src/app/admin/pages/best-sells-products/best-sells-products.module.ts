import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BestSellsProductsRoutingModule } from './best-sells-products-routing.module';
import { BestSellsProductsComponent } from './best-sells-products.component';
import {MaterialModule} from '../../../material/material.module';
import {SharedModule} from '../../../shared/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule} from '@angular/forms';
import {PipesModule} from '../../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    BestSellsProductsComponent
  ],
  imports: [
    CommonModule,
    BestSellsProductsRoutingModule,
    MaterialModule,
    SharedModule,
    NgxPaginationModule,
    FormsModule,
    PipesModule
  ]
})
export class BestSellsProductsModule { }
