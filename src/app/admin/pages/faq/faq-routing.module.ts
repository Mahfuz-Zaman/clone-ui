import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FaqComponent} from './faq.component';
import {AddFaqComponent} from './add-faq/add-faq.component';

const routes: Routes = [
  {path: '', component: FaqComponent},
  {path: 'add-faq', component: AddFaqComponent},
  {path: 'edit-faq/:id', component: AddFaqComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
