import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DealOnPlayComponent} from './deal-on-play.component';
import {AddNewDealOnPlayComponent} from './add-new-deal-on-play/add-new-deal-on-play.component';


const routes: Routes = [
  {path: '', component: DealOnPlayComponent},
  {path: 'add-new-deal-on-play', component: AddNewDealOnPlayComponent},
  {path: 'edit-deal-on-play/:id', component: AddNewDealOnPlayComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealOnPlayRoutingModule { }
