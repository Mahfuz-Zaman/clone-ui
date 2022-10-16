import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllProductListCalculationRoutingModule } from './all-product-list-calculation-routing.module';
import { FormsModule } from '@angular/forms';
import { GridCardModule } from 'src/app/shared/lazy-component/grid-card/grid-card.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MaterialModule } from 'src/app/material/material.module';
import { MatSliderModule } from '@angular/material/slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductCardOneModule } from 'src/app/shared/lazy-component/product-card-one/product-card-one.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllProductListCalculationComponent } from './all-product-list-calculation.component';


@NgModule({
  declarations: [
    AllProductListCalculationComponent
  ],
  imports: [
    CommonModule,
    AllProductListCalculationRoutingModule,
    SharedModule,
    ProductCardOneModule,
    MaterialModule,
    FormsModule,
    NgxPaginationModule,
    MatSliderModule,
    GridCardModule,
    LazyLoadImageModule,
  ],
})
export class AllProductListCalculationModule {}
