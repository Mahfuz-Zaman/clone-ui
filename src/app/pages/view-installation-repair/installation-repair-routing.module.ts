import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InstallationRepairComponent} from './installation-repair.component';


const routes: Routes = [
  {path: ':slug', component: InstallationRepairComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallationRepairRoutingModule { }
