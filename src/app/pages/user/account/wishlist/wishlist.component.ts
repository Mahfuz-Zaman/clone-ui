import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserDataService} from '../../../../services/user-data.service';
import {ReloadService} from '../../../../services/reload.service';
import {UiService} from 'src/app/services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {Wishlist} from '../../../../interfaces/wishlist';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit, OnDestroy {

  private subAcRoute: Subscription;

  wishlists: Wishlist[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  constructor(
    private userDataService: UserDataService,
    public reloadService: ReloadService,
    private uiService: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshWishlist$.subscribe(() => {
      this.getWishlistItemByUser();
    });

    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getWishlistItemByUser();
    });
  }

  public removeWishlistById(wishlistId: string) {
    this.userDataService.removeWishlistById(wishlistId)
      .subscribe(res => {
        this.reloadService.needRefreshWishlist$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
    this.reloadService.needRefreshWishlist$();
  }

  private getWishlistItemByUser() {
    this.spinner.show();
    this.userDataService.getWishlistItemByUser()
      .subscribe(res => {
        this.spinner.hide();
        this.wishlists = res.data;
        this.totalProducts = res.count;
      }, error => {
        this.spinner.hide();
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
