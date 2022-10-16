import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AfterSalesSupportComponent} from './after-sales-support.component';

const routes: Routes = [
  {
    path: '',
    component: AfterSalesSupportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AfterSalesSupportRoutingModule {
}
