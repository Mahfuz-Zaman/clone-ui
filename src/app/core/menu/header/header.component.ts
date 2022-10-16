import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {EMPTY} from 'rxjs';
import {Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../interfaces/product';
import {LOGO_PRIMARY} from '../../utils/ref-const';
import {ShopInfo} from '../../../interfaces/shop-info';
import {Pagination} from '../../../interfaces/pagination';
import {PromoPageService} from '../../../services/promo-page.service';
import {PromoPage} from '../../../interfaces/promo-page';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

  logoPrimary = LOGO_PRIMARY;

  @Output() sidenavNavToggle = new EventEmitter();

  @ViewChild('searchForm') searchForm: NgForm;
  @Input() scrollPosition = 0;
  @Input() shopInfo: ShopInfo;


  // Test
  searchProducts: Product[] = [];
  hide = true;
  hideAdBanner = false;

  // SEARCH AREA
  overlay = false;
  isOpen = false;
  isFocused = false;
  isLoading = false;
  isSelect = false;
  query = null;
  @ViewChild('searchInput') searchInput: ElementRef;


  // Placeholder Animation
  timeOutOngoing: any;
  char = 0;
  txt = 'Search products in Esquire...';
  promoPage: PromoPage;


  constructor(
    private productService: ProductService,
    public router: Router,
    private promoPageService: PromoPageService
  ) {
  }

  ngOnInit(): void {
    this.getPromoPage();
  }


  ngAfterViewInit(): void {
    this.searchAnim();
    const formValue = this.searchForm.valueChanges;

    formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.query = data.trim();
        if (this.query === '' || this.query === null) {
          this.overlay = false;
          this.searchProducts = [];
          this.query = null;
          return EMPTY;
        }
        this.isLoading = true;
        const pagination: Pagination = {
          currentPage: '1',
          pageSize: '10'
        };
        const filter = {productVisibility: true};
        return this.productService.getSearchProduct(data, pagination, filter);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        if (this.searchProducts.length > 0) {
          this.isOpen = true;
          this.overlay = true;
        }
      }, () => {
        this.isLoading = false;
      });
  }

  /**
   * HANDLE SEARCH
   * OVERLAY
   * SELECT
   */


  onClickHeader(): void {
    this.handleCloseOnly();
  }

  onClickSearchArea(event: MouseEvent): void {
    event.stopPropagation();
  }


  handleOverlay(): void {
    this.overlay = false;
    this.isOpen = false;
    this.isFocused = false;
  }

  handleFocus(event: FocusEvent): void {
    this.searchInput.nativeElement.focus();

    if (this.isFocused) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.setPanelState(event);
    }
    this.isFocused = true;
  }


  private setPanelState(event: FocusEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.isOpen = false;
    this.handleOpen();
  }


  handleOpen(): void {
    if (this.isOpen || this.isOpen && !this.isLoading) {
      return;
    }
    if (this.searchProducts.length > 0) {
      this.isOpen = true;
      this.overlay = true;
    }
  }

  handleOutsideClick(): void {
    if (!this.isOpen) {
      // this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseOnly(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.isFocused = false;
  }

  handleCloseAndClear(): void {
    if (!this.isOpen) {
      this.isFocused = false;
      return;
    }
    this.isOpen = false;
    this.overlay = false;
    this.searchProducts = [];
    this.isFocused = false;
  }


  onSelectItem(data: Product): void {
    this.handleCloseAndClear();
    // this.router.navigate(['/product-details', data?.productSlug]);
    this.router.navigate(['/', data?.brandSlug, data?.categorySlug, data?.productSlug]);
  }


  /**
   * ON TOGGLE SIDE MENU
   */
  onToggleSidenav() {
    this.sidenavNavToggle.emit();
  }

  /**
   * SEARCH PLACEHOLDER ANIMATION
   */
  private searchAnim() {
    const target = this.searchInput.nativeElement as HTMLInputElement;
    target.placeholder = '|';
    this.typeIt(target);
  }

  private typeIt(target: HTMLInputElement) {
    const humanize = Math.round(Math.random() * (300 - 30)) + 30;
    this.timeOutOngoing = setTimeout(() => {
      this.char++;
      const type = this.txt.substring(0, this.char);
      target.placeholder = type + '|';
      this.typeIt(target);

      if (this.char === this.txt.length) {
        // target.placeholder = txt.slice(0, -1);
        target.placeholder = '|';
        this.char = 0;
        // clearTimeout(timeOut);
      }

    }, humanize);
  }

  onNavigate() {
    if (this.router.url === '/') {
      this.onReload();
    } else {
      this.router.navigate(['/']);
    }
  }

  onReload() {
    window.location.reload();
  }

  private getPromoPage() {
    this.promoPageService.getPromoPage()
      .subscribe(res => {
        this.promoPage = res.data;
      }, err => {
        console.log(err);
      });
  }


  ngOnDestroy() {
    if (this.timeOutOngoing) {
      clearTimeout(this.timeOutOngoing);
    }
  }

  /*** header-banner-hide */
  bannerHide(){
    this.hideAdBanner = true;
  }

  get visibleAddBanner(): boolean {
    if (this.promoPage && this.promoPage.image) {
      if (this.scrollPosition <= 40 && this.hideAdBanner === false) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
