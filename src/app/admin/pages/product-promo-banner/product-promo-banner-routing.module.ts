import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductPromoBannerComponent } from './product-promo-banner.component';

const routes: Routes = [
  { path: '', component: ProductPromoBannerComponent },
  { path: 'edit-products-promo-banner/:id', component: ProductPromoBannerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductPromoBannerRoutingModule { }
