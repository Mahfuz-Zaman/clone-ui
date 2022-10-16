import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShopInfoComponent} from './shop-info.component';

const routes: Routes = [
  {
    path: '',
    component: ShopInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopInfoRoutingModule { }
