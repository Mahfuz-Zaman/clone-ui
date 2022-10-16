import { Component, OnInit } from '@angular/core';
import {FeaturedCategory} from '../../../interfaces/featured-category';
import {MatDialog} from '@angular/material/dialog';
import {DealOnPlayService} from '../../../services/deal-on-play.service';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {FeaturedCategoryService} from '../../../services/featured-category.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Product} from '../../../interfaces/product';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';

@Component({
  selector: 'app-featured-category',
  templateUrl: './featured-category.component.html',
  styleUrls: ['./featured-category.component.scss']
})
export class FeaturedCategoryComponent implements OnInit {

  allFeaturedCategory: FeaturedCategory[];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private featuredCategoryService: FeaturedCategoryService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshFeaturedCategory$.subscribe(() => {
      this.getAllFeaturedCategory();
    });
    this.getAllFeaturedCategory();
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
        this.deleteFeaturedCategoryById(id);
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

  private getAllFeaturedCategory() {
    this.featuredCategoryService.getAllFeaturedCategory()
      .subscribe(res => {
        this.allFeaturedCategory = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteFeaturedCategoryById(id: string) {
    this.featuredCategoryService.deleteFeaturedCategoryById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshFeaturedCategory$();
      }, error => {
        console.log(error);
      });
  }
}
