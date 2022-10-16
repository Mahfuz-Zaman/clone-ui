import { Component, OnInit } from '@angular/core';
import {FeaturedProduct} from '../../../interfaces/featured-product';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {FeaturedProductService} from '../../../services/featured-product.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Product} from '../../../interfaces/product';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';

@Component({
  selector: 'app-featured-product',
  templateUrl: './featured-product.component.html',
  styleUrls: ['./featured-product.component.scss']
})
export class FeaturedProductComponent implements OnInit {

  allFeaturedProduct: FeaturedProduct[] = [];

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private featuredProductService: FeaturedProductService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshFeaturedProduct$.subscribe(() => {
      this.getAllFeaturedProduct();
    });
    this.getAllFeaturedProduct();
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
        this.deleteFeaturedProductById(id);
      }
    });
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(product: Product) {
    console.log(product);
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

  private getAllFeaturedProduct() {
    this.featuredProductService.getAllFeaturedProduct()
      .subscribe(res => {
        this.allFeaturedProduct = res.data;
      }, error => {
        console.log(error);
      });
  }

  private deleteFeaturedProductById(id: string) {
    this.featuredProductService.deleteFeaturedProductById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshFeaturedProduct$();
      }, error => {
        console.log(error);
      });
  }
}
