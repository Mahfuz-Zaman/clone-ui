import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SubCategoriesComponent} from './sub-categories.component';
import {AddNewSubCategoryComponent} from './add-new-sub-category/add-new-sub-category.component';

const routes: Routes = [
  {path: '', component: SubCategoriesComponent},
  {path: 'add-new-sub-category', component: AddNewSubCategoryComponent},
  {path: 'edit-sub-category/:id', component: AddNewSubCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubCategoriesRoutingModule { }
