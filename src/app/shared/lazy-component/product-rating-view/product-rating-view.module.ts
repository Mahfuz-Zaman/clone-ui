import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRatingViewComponent } from './product-rating-view.component';



@NgModule({
  declarations: [
    ProductRatingViewComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ProductRatingViewComponent
  ]
})
export class ProductRatingViewModule { }
