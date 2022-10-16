import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstallationRepairRoutingModule } from './installation-repair-routing.module';
import { InstallationRepairComponent } from './installation-repair.component';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    InstallationRepairComponent
  ],
    imports: [
        CommonModule,
        InstallationRepairRoutingModule,
        ProductCardOneModule,
        PipesModule
    ]
})
export class InstallationRepairModule { }
