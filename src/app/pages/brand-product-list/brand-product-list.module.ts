import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandProductListRoutingModule } from './brand-product-list-routing.module';
import { BrandProductListComponent } from './brand-product-list.component';
import {SharedModule} from '../../shared/shared.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {MaterialModule} from '../../material/material.module';
import {FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {BreadcrumbModule} from '../../shared/lazy-component/breadcrumb/breadcrumb.module';
import {MatSliderModule} from '@angular/material/slider';
import {GridCardModule} from '../../shared/lazy-component/grid-card/grid-card.module';


@NgModule({
  declarations: [
    BrandProductListComponent
  ],
  imports: [
    CommonModule,
    BrandProductListRoutingModule,
    SharedModule,
    ProductCardOneModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    BreadcrumbModule,
    MatSliderModule,
    GridCardModule
  ]
})
export class BrandProductListModule { }
