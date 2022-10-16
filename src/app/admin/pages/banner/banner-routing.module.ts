import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BannerComponent} from './banner.component';
import {AddNewBannerComponent} from './add-new-banner/add-new-banner.component';

const routes: Routes = [
  {path: '', component: BannerComponent},
  {path: 'add-new-banner', component: AddNewBannerComponent},
  {path: 'edit-banner/:id', component: AddNewBannerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannerRoutingModule { }
