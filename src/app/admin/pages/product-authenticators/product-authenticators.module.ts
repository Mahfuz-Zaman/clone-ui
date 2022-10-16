import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAuthenticatorsRoutingModule } from './product-authenticators-routing.module';
import { ProductAuthenticatorsComponent } from './product-authenticators.component';
import { AddNewProductAuthenticatorComponent } from './add-new-product-authenticator/add-new-product-authenticator.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';


@NgModule({
  declarations: [
    ProductAuthenticatorsComponent,
    AddNewProductAuthenticatorComponent
  ],
  imports: [
    CommonModule,
    ProductAuthenticatorsRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    NgxPaginationModule
  ]
})
export class ProductAuthenticatorsModule { }
