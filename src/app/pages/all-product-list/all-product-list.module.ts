import { GridCardModule } from './../../shared/lazy-component/grid-card/grid-card.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProductListRoutingModule } from './all-product-list-routing.module';
import { AllProductListComponent } from './all-product-list.component';
import {SharedModule} from '../../shared/shared.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {MaterialModule} from '../../material/material.module';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {MatSliderModule} from '@angular/material/slider';
import {LazyLoadImageModule} from 'ng-lazyload-image';

@NgModule({
  declarations: [AllProductListComponent],
  imports: [
    CommonModule,
    AllProductListRoutingModule,
    SharedModule,
    ProductCardOneModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    MatSliderModule,
    GridCardModule,
    LazyLoadImageModule
  ]
})
export class AllProductListModule { }
