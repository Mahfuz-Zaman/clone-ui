import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {StoreInfoComponent} from './store-info.component';
import {AddStoreInfoComponent} from './add-store-info/add-store-info.component';

const routes: Routes = [
  {path: '', component: StoreInfoComponent},
  {path: 'add-store-info', component: AddStoreInfoComponent},
  {path: 'edit-store-info/:id', component: AddStoreInfoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreInfoRoutingModule { }
