import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardTwoComponent } from './product-card-two.component';



@NgModule({
    declarations: [
        ProductCardTwoComponent
    ],
    exports: [
        ProductCardTwoComponent
    ],
    imports: [
        CommonModule
    ]
})
export class ProductCardTwoModule { }
