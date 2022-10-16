import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardFoodComponent } from './product-card-food.component';



@NgModule({
    declarations: [
        ProductCardFoodComponent
    ],
    exports: [
        ProductCardFoodComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ProductCardFoodModule { }
