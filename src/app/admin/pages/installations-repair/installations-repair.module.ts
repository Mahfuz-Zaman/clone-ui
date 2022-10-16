import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstallationsRepairRoutingModule } from './installations-repair-routing.module';
import { InstallationsRepairComponent } from './installations-repair.component';
import { AddInstallationRepairComponent } from './add-installation-repair/add-installation-repair.component';
import {MaterialModule} from '../../../material/material.module';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    InstallationsRepairComponent,
    AddInstallationRepairComponent
  ],
  imports: [
    CommonModule,
    InstallationsRepairRoutingModule,
    MaterialModule,
    PipesModule,
    ReactiveFormsModule,
    FlexModule
  ]
})
export class InstallationsRepairModule { }
