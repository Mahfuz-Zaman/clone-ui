import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllProductListCalculationComponent } from './all-product-list-calculation.component';

const routes: Routes = [
  { path: '', component: AllProductListCalculationComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllProductListCalculationRoutingModule { }
