import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AllProductListComponent} from './all-product-list.component';

const routes: Routes = [
  {path: '', component: AllProductListComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllProductListRoutingModule { }
