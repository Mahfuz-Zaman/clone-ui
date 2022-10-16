import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CareerEsquireComponent} from './career-esquire.component';
import {CareerEsquireDetailsComponent} from './career-esquire-details/career-esquire-details.component';

const routes: Routes = [
  {path: '', component: CareerEsquireComponent},
  {path: ':slug', component: CareerEsquireDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CareerEsquireRoutingModule { }
