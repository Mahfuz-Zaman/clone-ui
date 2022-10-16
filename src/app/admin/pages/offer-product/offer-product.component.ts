import {Component, OnDestroy, OnInit} from '@angular/core';
import {OfferProduct} from '../../../interfaces/offer-product';
import {Product} from '../../../interfaces/product';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {OfferProductService} from '../../../services/offer-product.service';
import {ProductViewTableOneComponent} from '../components/product-view-table-one/product-view-table-one.component';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Pagination} from '../../../interfaces/pagination';

@Component({
  selector: 'app-offer-product',
  templateUrl: './offer-product.component.html',
  styleUrls: ['./offer-product.component.scss']
})
export class OfferProductComponent implements OnInit, OnDestroy {

  // Subscriptions
  private subAcRoute: Subscription;

  allOfferProducts: OfferProduct[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 6;
  totalProductsStore = 0;

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private offerProductService: OfferProductService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshOfferProduct$.subscribe(() => {
      this.getAllOfferProduct();
    });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllOfferProduct();
    });

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
        this.deleteOfferProductById(id);
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

  private getAllOfferProduct() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.offerProductService.getAllOfferProduct(pagination)
      .subscribe(res => {
        this.spinner.hide();
        this.allOfferProducts = res.data;
        this.totalProducts = res.count;
        this.totalProductsStore = res.count;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private deleteOfferProductById(id: string) {
    this.offerProductService.deleteOfferProductById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshOfferProduct$();
      }, error => {
        console.log(error);
      });
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
  }
}
