import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeaturedProductComponent} from './featured-product.component';
import {AddNewFeaturedProductComponent} from './add-new-featured-product/add-new-featured-product.component';

const routes: Routes = [
  {path: '', component: FeaturedProductComponent},
  {path: 'add-new-featured-product', component: AddNewFeaturedProductComponent},
  {path: 'edit-featured-product/:id', component: AddNewFeaturedProductComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturedProductRoutingModule { }
