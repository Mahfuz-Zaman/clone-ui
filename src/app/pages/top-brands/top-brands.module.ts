import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopBrandsRoutingModule } from './top-brands-routing.module';
import { TopBrandsComponent } from './top-brands.component';
import {BrandCardOneModule} from '../../shared/lazy-component/brand-card-one/brand-card-one.module';
import {MaterialModule} from '../../material/material.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    TopBrandsComponent
  ],
  imports: [
    CommonModule,
    TopBrandsRoutingModule,
    BrandCardOneModule,
    MaterialModule,
    NgxPaginationModule,
    SharedModule
  ]
})
export class TopBrandsModule { }
