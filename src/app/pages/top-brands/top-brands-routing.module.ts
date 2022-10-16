import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TopBrandsComponent} from './top-brands.component';

const routes: Routes = [
  {path: '', component: TopBrandsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopBrandsRoutingModule { }
