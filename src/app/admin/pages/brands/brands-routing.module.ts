import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BrandsComponent} from './brands.component';
import {AddNewBrandComponent} from './add-new-brand/add-new-brand.component';


const routes: Routes = [
  {path: '', component: BrandsComponent},
  {path: 'add-new-brand', component: AddNewBrandComponent},
  {path: 'edit-brand/:id', component: AddNewBrandComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandsRoutingModule { }
