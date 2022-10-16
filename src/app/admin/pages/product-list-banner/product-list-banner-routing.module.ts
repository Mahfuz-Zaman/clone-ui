import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductListBannerComponent} from './product-list-banner.component';
import {AddProductListBannerComponent} from './add-product-list-banner/add-product-list-banner.component';


const routes: Routes = [
  {path: '', component: ProductListBannerComponent},
  {path: 'add-new-product-list-banner', component: AddProductListBannerComponent},
  {path: 'edit-product-list-banner/:id', component: AddProductListBannerComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductListBannerRoutingModule { }
