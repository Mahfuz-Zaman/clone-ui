import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CategoriesComponent} from './categories.component';
import {AddNewCategoryComponent} from './add-new-category/add-new-category.component';


const routes: Routes = [
  {path: '', component: CategoriesComponent},
  {path: 'add-new-category', component: AddNewCategoryComponent},
  {path: 'edit-category/:id', component: AddNewCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
