import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackupRestoreRoutingModule } from './backup-restore-routing.module';
import { BackupRestoreComponent } from './backup-restore.component';
import {MaterialModule} from '../../../material/material.module';
import {NgxSpinnerModule} from 'ngx-spinner';
import {PipesModule} from '../../../shared/pipes/pipes.module';


@NgModule({
  declarations: [BackupRestoreComponent],
  imports: [
    CommonModule,
    BackupRestoreRoutingModule,
    MaterialModule,
    NgxSpinnerModule,
    PipesModule
  ]
})
export class BackupRestoreModule { }
