import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InstallationRepairTypesComponent} from './installation-repair-types.component';
import {AddInstallationRepairTypeComponent} from './add-installation-repair-type/add-installation-repair-type.component';

const routes: Routes = [
  {path: '', component: InstallationRepairTypesComponent},
  {path: 'add-installation-repair-type', component: AddInstallationRepairTypeComponent},
  {path: 'edit-installation-repair-type/:id', component: AddInstallationRepairTypeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstallationRepairTypesRoutingModule { }
