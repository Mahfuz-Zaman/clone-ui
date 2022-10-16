import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InstallationsRepairComponent} from './installations-repair.component';
import {AddInstallationRepairComponent} from './add-installation-repair/add-installation-repair.component';

const routes: Routes = [
  {path: '', component: InstallationsRepairComponent},
  {path: 'add-new-installation-and-repair', component: AddInstallationRepairComponent},
  {path: 'edit-installation-and-repair/:id', component: AddInstallationRepairComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallationsRepairRoutingModule { }
