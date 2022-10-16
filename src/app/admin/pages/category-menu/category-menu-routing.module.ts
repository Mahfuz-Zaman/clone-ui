import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategoryMenuComponent} from './category-menu.component';
import {AddCategoryMenuComponent} from './add-category-menu/add-category-menu.component';

const routes: Routes = [
  {path: '', component: CategoryMenuComponent},
  {path: 'add-category-menu', component: AddCategoryMenuComponent},
  {path: 'edit-category-menu/:id', component: AddCategoryMenuComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryMenuRoutingModule { }
