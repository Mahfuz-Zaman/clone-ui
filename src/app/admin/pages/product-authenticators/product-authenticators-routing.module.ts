import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProductAuthenticatorsComponent} from './product-authenticators.component';
import {AddNewProductAuthenticatorComponent} from './add-new-product-authenticator/add-new-product-authenticator.component';

const routes: Routes = [
  {path: '', component: ProductAuthenticatorsComponent},
  {path: 'add-new-product-authenticator', component: AddNewProductAuthenticatorComponent},
  {path: 'edit-product-authenticator/:id', component: AddNewProductAuthenticatorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductAuthenticatorsRoutingModule { }
