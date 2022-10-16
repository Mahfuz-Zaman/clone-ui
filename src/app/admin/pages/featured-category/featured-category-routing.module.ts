import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FeaturedCategoryComponent} from './featured-category.component';
import {AddNewFeaturedCategoryComponent} from './add-new-featured-category/add-new-featured-category.component';

const routes: Routes = [
  {path: '', component: FeaturedCategoryComponent},
  {path: 'add-new-featured-category', component: AddNewFeaturedCategoryComponent},
  {path: 'edit-featured-category/:id', component: AddNewFeaturedCategoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturedCategoryRoutingModule { }
