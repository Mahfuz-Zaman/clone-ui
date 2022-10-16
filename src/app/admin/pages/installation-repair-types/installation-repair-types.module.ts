import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstallationRepairTypesRoutingModule } from './installation-repair-types-routing.module';
import { InstallationRepairTypesComponent } from './installation-repair-types.component';
import { AddInstallationRepairTypeComponent } from './add-installation-repair-type/add-installation-repair-type.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [
    InstallationRepairTypesComponent,
    AddInstallationRepairTypeComponent
  ],
  imports: [
    CommonModule,
    InstallationRepairTypesRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AngularEditorModule,
    SharedModule
  ]
})
export class InstallationRepairTypesModule { }
