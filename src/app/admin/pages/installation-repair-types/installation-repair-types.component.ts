import { Component, OnInit } from '@angular/core';
import {InstallationRepairType} from '../../../interfaces/installation-repair-type';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {InstallationRepairTypeService} from '../../../services/installation-repair-type.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-installation-repair-types',
  templateUrl: './installation-repair-types.component.html',
  styleUrls: ['./installation-repair-types.component.scss']
})
export class InstallationRepairTypesComponent implements OnInit {

  allInstallationRepairType: InstallationRepairType[] = [];

  constructor(
    private dialog: MatDialog,
    private installationRepairTypeService: InstallationRepairTypeService,
    private uiService: UiService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshInstallationRepairTypes$
      .subscribe(() => {
        this.getAllInstallationRepairType();
      });
    this.getAllInstallationRepairType();
  }

  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this folder name?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteInstallationRepairTypeById(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */
  private getAllInstallationRepairType() {
    this.installationRepairTypeService.getAllInstallationRepairType()
      .subscribe(res => {
        this.allInstallationRepairType = res.data;
        // console.log(res.data);
      }, err => {
        console.log(err);
      });
  }

  private deleteInstallationRepairTypeById(id: string) {
    this.installationRepairTypeService.deleteInstallationRepairTypeById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshPromotionalOffer$();
      }, error => {
        console.log(error);
      });
  }
}
