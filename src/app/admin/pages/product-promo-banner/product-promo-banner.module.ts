import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductPromoBannerRoutingModule } from './product-promo-banner-routing.module';
import { FlexModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material/material.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductPromoBannerComponent } from './product-promo-banner.component';


@NgModule({
  declarations: [
    ProductPromoBannerComponent
  ],
  imports: [
    CommonModule,
    ProductPromoBannerRoutingModule,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatIconModule,
    MaterialModule,
    SharedModule,
  ],
})
export class ProductPromoBannerModule {}
