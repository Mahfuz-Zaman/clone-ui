import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {DealOnPlayService} from '../../../services/deal-on-play.service';
import {DealOnPlay} from '../../../interfaces/deal-on-play';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';
import {Product} from '../../../interfaces/product';

@Component({
  selector: 'app-categories',
  templateUrl: './deal-on-play.component.html',
  styleUrls: ['./deal-on-play.component.scss']
})
export class DealOnPlayComponent implements OnInit {

  allDealOnPlay: DealOnPlay[] = [];

  constructor(
    private dialog: MatDialog,
    private dealOnPlayService: DealOnPlayService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshDealOnPlay$.subscribe(() => {
      this.getAllDealOnPlay();
    });
    this.getAllDealOnPlay();
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
        this.deleteDealOnPlayById(id);
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
      maxHeight: '90vh',
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

  private getAllDealOnPlay() {
    this.dealOnPlayService.getAllDealOnPlay()
      .subscribe(res => {
        this.allDealOnPlay = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteDealOnPlayById(id: string) {
    this.dealOnPlayService.deleteDealOnPlayById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshDealOnPlay$();
      }, error => {
        console.log(error);
      });
  }


}
