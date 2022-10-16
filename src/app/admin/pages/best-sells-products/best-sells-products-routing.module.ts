import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BestSellsProductsComponent} from './best-sells-products.component';

const routes: Routes = [
  {path: '', component: BestSellsProductsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BestSellsProductsRoutingModule { }
