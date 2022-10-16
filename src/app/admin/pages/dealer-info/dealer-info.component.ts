import { Component, OnInit } from '@angular/core';
import {DealerInfo} from '../../../interfaces/dealer-info';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {StoreInfoService} from '../../../services/store-info.service';
import {DealerInfoService} from '../../../services/dealer-info.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dealer-info',
  templateUrl: './dealer-info.component.html',
  styleUrls: ['./dealer-info.component.scss']
})
export class DealerInfoComponent implements OnInit {

  dealers: DealerInfo[] = [];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private dealerInfoService: DealerInfoService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshDealerInfo$
      .subscribe(() => {
        this.getAllDealersInfo();
      });
    this.getAllDealersInfo();
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
        this.deleteDealerInfoByDealerInfoId(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllDealersInfo() {
    this.dealerInfoService.getAllDealersInfo()
      .subscribe(res => {
        this.dealers = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteDealerInfoByDealerInfoId(id: string) {
    this.dealerInfoService.deleteDealerInfoByDealerInfoId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshStoreInfos$();
      }, error => {
        console.log(error);
      });
  }
}
