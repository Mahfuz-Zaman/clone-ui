import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AboutUsPagesComponent} from './about-us-pages.component';
import {AddAboutUsPagesComponent} from './add-about-us-pages/add-about-us-pages.component';

const routes: Routes = [
  {path: '', component: AboutUsPagesComponent},
  {path: 'add-about-us', component: AddAboutUsPagesComponent},
  {path: 'edit-about-us/:id', component: AddAboutUsPagesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AboutUsPagesRoutingModule { }
