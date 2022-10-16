import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EMPTY, Subscription} from 'rxjs';
import {ProductBrand} from '../../../interfaces/product-brand';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {BrandService} from '../../../services/brand.service';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';

import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {PromotionalOffer} from '../../../interfaces/promotional-offer';
import {PromotionalOfferService} from '../../../services/promotional-offer.service';
import {ProductListBannerService} from '../../../services/product-list-banner.service';
import {ProductListBanner} from '../../../interfaces/product-list-banner';

@Component({
  selector: 'app-product-list-banner',
  templateUrl: './product-list-banner.component.html',
  styleUrls: ['./product-list-banner.component.scss']
})
export class ProductListBannerComponent implements OnInit, OnDestroy {

  //Subscription
  private subReloadService : Subscription;
  private subPromotionalOfferService : Subscription;
  private subPromotionalOfferServiceOne : Subscription;

  allPromotionalOffer: ProductListBanner[] = [];

  constructor(
    private dialog: MatDialog,
    private promotionalOfferService: ProductListBannerService,
    private uiService: UiService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshPromotionalOffer$
      .subscribe(() => {
        this.getAllProductListBanner();
      });
    this.getAllProductListBanner();
  }

   /**
   * ON Dialog
   */

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
        this.deletePromotionalOfferById(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */
  private getAllProductListBanner() {
    this.subPromotionalOfferService = this.promotionalOfferService.getAllProductListBanner()
      .subscribe(res => {
        this.allPromotionalOffer = res.data;
        // console.log(res.data);
      }, err => {
        console.log(err);
      });
  }

  private deletePromotionalOfferById(id: string) {
    this.subPromotionalOfferServiceOne = this.promotionalOfferService.deletePromotionalOfferById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshPromotionalOffer$();
      }, error => {
        console.log(error);
      });
  }


  ngOnDestroy(): void {
      if (this.subReloadService) {
        this.subReloadService.unsubscribe();
      }
      if (this.subPromotionalOfferService) {
        this.subPromotionalOfferService.unsubscribe();
      }
      if (this.subPromotionalOfferServiceOne) {
        this.subPromotionalOfferServiceOne.unsubscribe();
      }
  }
}
