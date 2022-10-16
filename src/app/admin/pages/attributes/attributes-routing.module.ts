import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AttributesComponent} from './attributes.component';
import {AddNewAttributeComponent} from './add-new-attribute/add-new-attribute.component';

const routes: Routes = [
  {path: '', component: AttributesComponent},
  {path: 'add-new-attribute', component: AddNewAttributeComponent},
  {path: 'edit-attribute/:id', component: AddNewAttributeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttributesRoutingModule { }
