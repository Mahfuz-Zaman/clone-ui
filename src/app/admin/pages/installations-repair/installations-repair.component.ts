import { Component, OnInit } from '@angular/core';
import {InstallationRepair} from '../../../interfaces/installation-repair';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {InstallationRepairService} from '../../../services/installation-repair.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Product} from '../../../interfaces/product';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';

@Component({
  selector: 'app-installations-repair',
  templateUrl: './installations-repair.component.html',
  styleUrls: ['./installations-repair.component.scss']
})
export class InstallationsRepairComponent implements OnInit {

  allInstallationsAndRepair: InstallationRepair[] = [];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private installationRepairService: InstallationRepairService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshOfferProduct$.subscribe(() => {
      this.getAllInstallationRepair();
    });
    this.getAllInstallationRepair();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(id?: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteInstallationRepairById(id);
      }
    });
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(products: Product[]) {
    // console.log(products);
    const dialogRef = this.dialog.open(ProductViewTableOneComponent, {
      data: products,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // TODO IF CLOSE
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllInstallationRepair() {
    this.installationRepairService.getAllInstallationRepair()
      .subscribe(res => {
        this.allInstallationsAndRepair = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteInstallationRepairById(id: string) {
    this.installationRepairService.deleteInstallationRepairById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshOfferProduct$();
      }, error => {
        console.log(error);
      });
  }

}
