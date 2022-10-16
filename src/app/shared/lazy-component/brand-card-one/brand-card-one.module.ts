import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandCardOneComponent } from './brand-card-one.component';



@NgModule({
    declarations: [
        BrandCardOneComponent
    ],
    exports: [
        BrandCardOneComponent
    ],
    imports: [
        CommonModule
    ]
})
export class BrandCardOneModule { }
