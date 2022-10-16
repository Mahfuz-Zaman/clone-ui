import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BrandProductListComponent} from './brand-product-list.component';

const routes: Routes = [
  {path: ':brandSlug', component: BrandProductListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandProductListRoutingModule { }
