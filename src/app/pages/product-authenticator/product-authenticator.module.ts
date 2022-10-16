import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductAuthenticatorRoutingModule } from './product-authenticator-routing.module';
import { ProductAuthenticatorComponent } from './product-authenticator.component';
import {MaterialModule} from '../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ImageCaptchaModule} from '../../shared/lazy-component/image-captcha/image-captcha.module';


@NgModule({
  declarations: [
    ProductAuthenticatorComponent
  ],
  imports: [
    CommonModule,
    ProductAuthenticatorRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ImageCaptchaModule
  ]
})
export class ProductAuthenticatorModule { }
