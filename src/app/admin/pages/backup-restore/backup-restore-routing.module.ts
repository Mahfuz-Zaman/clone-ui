import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BackupRestoreComponent} from './backup-restore.component';

const routes: Routes = [
  {path: '', component: BackupRestoreComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackupRestoreRoutingModule { }
