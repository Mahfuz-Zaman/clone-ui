import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {DealsOfTheDayService} from '../../../services/deals-of-the-day.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Product} from '../../../interfaces/product';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';
import {DealsOfTheDay} from '../../../interfaces/deals-of-the-day';

@Component({
  selector: 'app-deals-of-the-day',
  templateUrl: './deals-of-the-day.component.html',
  styleUrls: ['./deals-of-the-day.component.scss']
})
export class DealsOfTheDayComponent implements OnInit {

  allDealsOfTheDay: DealsOfTheDay[] = [];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private dealsOfTheDayService: DealsOfTheDayService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshDealsOfTheDay$.subscribe(() => {
      this.getAllDealsOfTheDay();
    });
    this.getAllDealsOfTheDay();
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
        this.deleteDealsOfTheDayById(id);
      }
    });
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(product: Product) {
    // console.log(product);
    const products = [product];
    // console.log('My products');
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

  private getAllDealsOfTheDay() {
    this.dealsOfTheDayService.getAllDealsOfTheDay()
      .subscribe(res => {
        this.allDealsOfTheDay = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteDealsOfTheDayById(id: string) {
    this.dealsOfTheDayService.deleteDealsOfTheDayById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshDealsOfTheDay$();
      }, error => {
        console.log(error);
      });
  }
}
