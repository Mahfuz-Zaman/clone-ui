import {MenuCtrService} from './../../../services/menu-ctr.service';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MenuService} from 'src/app/services/menu.service';
import {User} from '../../../interfaces/user';
import {UserService} from '../../../services/user.service';
import {UserDataService} from '../../../services/user-data.service';
import {ReloadService} from '../../../services/reload.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatMenu, MatMenuTrigger} from '@angular/material/menu';
import {Cart} from '../../../interfaces/cart';
import {CartService} from '../../../services/cart.service';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../interfaces/product';
import {PricePipe} from '../../../shared/pipes/price.pipe';
import {IconTypeEnum} from '../../../enum/icon-type.enum';
import {MenuSide} from '../../../interfaces/menu-side';
import {PromotionalOffer} from '../../../interfaces/promotional-offer';
import {CategoryMenu} from '../../../interfaces/category-menu';
import {InstallationRepairType} from '../../../interfaces/installation-repair-type';
import {AboutUs} from '../../../interfaces/about-us';

@Component({
  selector: 'app-mega-menu',
  templateUrl: './mega-menu.component.html',
  styleUrls: ['./mega-menu.component.scss'],
  providers: [PricePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MegaMenuComponent implements OnInit {
  @Input() scrollPosition = 0;
  @Input() mobileCatMenu: MenuSide[] = [];
  @Input() categoryMenus: CategoryMenu[] = [];
  @Input() installationRepairTypes: InstallationRepairType[] = [];
  @Input() promotionalOffers: PromotionalOffer[] = [];
  @Input() aboutUses: AboutUs[] = [];
  @Output() sidenavNavToggle = new EventEmitter();
  @ViewChild('menuCartTrigger') menuCartTrigger: MatMenuTrigger;
  @ViewChild('menuCart') menuCart: MatMenu;


  isOpen = false;
  catSlide = false;
  catSubMenu = false;


  // User Data
  user: User = null;
  isUserAuth = false;

  // CARTS
  carts: Cart[];
  cartsItemsCount = 0;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  iconType = IconTypeEnum;
  compareItemsCount = 0;


  constructor(
    public router: Router,
    private breakpointObserver: BreakpointObserver,
    private menuService: MenuService,
    public userService: UserService,
    public userDataService: UserDataService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private productService: ProductService,
    private cd: ChangeDetectorRef,
    private pricePipe: PricePipe,
    private menuCntrServices: MenuCtrService
  ) {
  }

  /**
   * CALCULATION
   */

  get cartSubTotal(): number {
    if (this.carts && this.carts.length > 0) {
      return this.carts.map(t => {
        return this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
      }).reduce((acc, value) => acc + value, 0);
    } else {
      return 0;
    }
  }

  ngOnInit(): void {

    this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserInfo();
      }
    });
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserInfo();
    }

    // CART FUNCTION
    this.reloadService.refreshCart$.subscribe(() => {
      this.getCartsItems(true);
      this.cd.markForCheck();
    });
    this.getCartsItems();

    this.reloadService.refreshCompareList$.subscribe(() => {
      this.getCompareList();
      this.cd.markForCheck();
    });
    this.getCompareList();

  }

  /**
   * COMPARE
   */
  getCompareList() {
    this.compareItemsCount = this.productService.getCompareList().length;
  }

  onLogout() {
    this.userService.userLogOut();
  }

  /**
   * ON TOGGLE SIDE MENU
   */
  onToggleSidenav() {
    this.sidenavNavToggle.emit();
  }

  onClose(event: MouseEvent) {
    event.stopPropagation();
    this.menuCartTrigger.closeMenu();
  }

  /**
   * CART FUNCTIONALITY
   */
  onDeleteCartItem(event: any, cartId: string, product: string) {
    if (this.userService.getUserStatus()) {
      this.cartService.removeCartItem(cartId)
        .subscribe(() => {
          this.reloadService.needRefreshCart$();
          this.menuCartTrigger.ngAfterContentInit();
        }, error => {
          console.log(error);
        });
    } else {
      this.cartService.deleteCartItemFromLocalStorage(product);
      this.reloadService.needRefreshCart$();
      this.menuCartTrigger.ngAfterContentInit();
    }
  }

  onCatNavClick(mouseEvent: MouseEvent) {
    this.router.events.subscribe(event => {
      this.isOpen = false;
    });
  }

  onCatNavClickMobile(mouseEvent: MouseEvent) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isOpen = false;
      }
    });
  }

  catSlideActive() {
    this.catSlide = true;
  }

  catSlideInactive() {
    this.catSlide = false;
  }

  catSubToggle() {
    this.catSubMenu = !this.catSubMenu;
  }

  /**
   * HTTP REQ HANDLE
   */

  private getLoggedInUserInfo() {
    const select = 'fullName';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * CART DATA
   */
  private getCartsItems(refresh?: boolean) {
    if (this.userService.getUserStatus()) {
      this.cartService.getCartItemList()
        .subscribe(res => {
          this.carts = res.data;
          if (refresh) {
            this.openCartDropdown();
          }
        });
    } else {
      this.getCarsItemFromLocal(refresh);
    }

  }

  private getCarsItemFromLocal(refresh?: boolean) {
    const items = this.cartService.getCartItemFromLocalStorage();

    if (items && items.length > 0) {
      const ids: string[] = items.map(m => m.product as string);
      this.productService.getSpecificProductsById(ids, 'productName productSlug  price discountType discountAmount  quantity images')
        .subscribe(res => {
          const products = res.data;
          if (products && products.length > 0) {
            this.carts = items.map(t1 => ({...t1, ...{product: products.find(t2 => t2._id === t1.product)}}));
            if (refresh) {
              this.openCartDropdown();
            }
          }
        });
    } else {
      this.carts = [];
    }
  }

  private openCartDropdown() {
    if (this.router.url !== '/cart') {
      // this.menuCart.hasBackdrop = false;
      this.menuCartTrigger.openMenu();
    }
  }

}
