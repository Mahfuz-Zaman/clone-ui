import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DealsOfTheDayComponent} from './deals-of-the-day.component';
import {AddNewDealsOfTheDayComponent} from './add-new-deals-of-the-day/add-new-deals-of-the-day.component';

const routes: Routes = [
  {path: '', component: DealsOfTheDayComponent},
  {path: 'add-new-deal-of-the-day', component: AddNewDealsOfTheDayComponent},
  {path: 'edit-deal-of-the-day/:id', component: AddNewDealsOfTheDayComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealsOfTheDayRoutingModule { }
