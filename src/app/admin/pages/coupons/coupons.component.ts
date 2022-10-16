import {Component, OnDestroy, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {CouponService} from '../../../services/coupon.service';
import {Coupon} from '../../../interfaces/coupon';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Pagination} from '../../../interfaces/pagination';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit, OnDestroy {

  // Subscriptions
  private subAcRoute: Subscription;
  private subDataOne: Subscription;

  coupons: Coupon[];
  holdPrevData: Coupon[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 3;
  totalProductsStore = 0;

  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private couponService: CouponService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCoupons$
      .subscribe(() => {
        this.getAllCoupons();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllCoupons();
    });

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
        this.deleteCoupon(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllCoupons() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.couponService.getAllCoupons()
      .subscribe(res => {
        // console.log("coupon", res.data);
        this.coupons = res.data;
        // this.totalProducts = res.count;
        this.holdPrevData = res.data;
        this.totalProductsStore = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private deleteCoupon(id: string) {
    this.couponService.deleteCoupon(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCoupons$();
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
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }


}
