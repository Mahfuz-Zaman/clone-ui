import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {RolesComponent} from './roles.component';
import {AddRoleComponent} from './add-role/add-role.component';

const routes: Routes = [
  {path: '', component: RolesComponent},
  {path: 'add-new-role', component: AddRoleComponent},
  {path: 'edit-role/:id', component: AddRoleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
