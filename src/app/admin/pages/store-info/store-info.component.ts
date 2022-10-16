import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {StoreInfoService} from '../../../services/store-info.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {StoreInfo} from '../../../interfaces/store-info';

@Component({
  selector: 'app-store-info',
  templateUrl: './store-info.component.html',
  styleUrls: ['./store-info.component.scss']
})
export class StoreInfoComponent implements OnInit {

  stores: StoreInfo[] = [];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private storeInfoService: StoreInfoService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshStoreInfos$
      .subscribe(() => {
        this.getAllStoresInfo();
      });
    this.getAllStoresInfo();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteStoreInfo(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllStoresInfo() {
    this.storeInfoService.getAllStoresInfo()
      .subscribe(res => {
        this.stores = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteStoreInfo(id: string) {
    this.storeInfoService.deleteStoreInfoByStoreInfoId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshStoreInfos$();
      }, error => {
        console.log(error);
      });
  }
}
