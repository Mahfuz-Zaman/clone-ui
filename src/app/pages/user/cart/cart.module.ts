import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {MaterialModule} from '../../../material/material.module';
import {ProductCartViewOneModule} from '../../../shared/lazy-component/product-cart-view-one/product-cart-view-one.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {FormsModule} from '@angular/forms';


const routes: Routes = [
  {path: '', component: CartComponent}
];


@NgModule({
  declarations: [CartComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    MaterialModule,
    ProductCartViewOneModule,
    PipesModule,
    FormsModule
  ]
})
export class CartModule { }
