import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSliderChange } from '@angular/material/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Pagination } from 'src/app/interfaces/pagination';
import { Product } from 'src/app/interfaces/product';
import { ProductBrand } from 'src/app/interfaces/product-brand';
import { ProductCategory } from 'src/app/interfaces/product-category';
import { ProductFilter } from 'src/app/interfaces/product-filter';
import { ProductListBanner } from 'src/app/interfaces/product-list-banner';
import { ProductSubCategory } from 'src/app/interfaces/product-sub-category';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { ProductListBannerService } from 'src/app/services/product-list-banner.service';
import { ProductService } from 'src/app/services/product.service';
import { ReloadService } from 'src/app/services/reload.service';
import { SubCategoryService } from 'src/app/services/sub-category.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-all-product-list-calculation',
  templateUrl: './all-product-list-calculation.component.html',
  styleUrls: ['./all-product-list-calculation.component.scss'],
})
export class AllProductListCalculationComponent implements OnInit, OnDestroy {
  // SUBSCRIPTION
  private subProduct: Subscription;
  private subCat: Subscription;
  private subSubCat: Subscription;
  private subAcRoute: Subscription;
  private subForm: Subscription;

  // View Type
  viewType = 'grid';

  // Store Data
  products: Product[] = [];
  categories: ProductCategory[] = [];
  brands: ProductBrand[] = [];
  subCategories: ProductSubCategory[] = [];
  allProductListBanner: ProductListBanner[] = [];

  // Price Range
  minPrice: number = null;
  maxPrice: number = null;
  rangeSet = false;
  priceRange: { min: number; max: number } = { min: 0, max: 0 };
  minView = 0;
  maxView = 0;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 16;
  // totalProductsStore = 0;

  // Query
  query: ProductFilter = null;

  // For Reset
  catFilter: string;
  brandFilter: any;
  subCatFilter: any;

  select =
    'productName images productSlug price discountType discountAmount category brand quantity campaignStartDate campaignEndDate campaignStartTime campaignEndTime';

  // MOBILE FILTER DIALOG
  @ViewChild('dialogFilter') dialogFilter: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private brandService: BrandService,
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private productListBannerService: ProductListBannerService,
    private uiService: UiService,
    private reloadService: ReloadService
  ) {}

  ngOnInit(): void {
    this.reloadService.refreshPromotionalOffer$.subscribe(() => {
      this.getAllProductListBanner();
    });
    this.getAllProductListBanner();

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe((qParam) => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllProducts();
    });

    // GET
    this.getAllCategory();
    this.getAllBrands();
  }

  /**
   * PRICE RANGE
   */

  onInputChangeMin(event: MatSliderChange) {
    this.router.navigate([], { queryParams: { page: 1 } });
    setTimeout(() => {
      this.rangeSet = true;
      this.minPrice = event.value;
      this.onFilterPriceRange();
    }, 500);
  }

  onInputChangeMax(event: MatSliderChange) {
    this.router.navigate([], { queryParams: { page: 1 } });
    setTimeout(() => {
      this.rangeSet = true;
      this.maxPrice = event.value;
      this.onFilterPriceRange();
    }, 500);
  }

  onInputChangeSlideMin(event: MatSliderChange) {
    this.minView = event.value;
  }

  onInputChangeSlideMax(event: MatSliderChange) {
    this.maxView = event.value;
  }
  /**
   * OPEN FILTER DIALOG
   */

  public openTemplateDialog(data?: any) {
    this.dialog.open(this.dialogFilter, {
      data,
      panelClass: ['theme-dialog', 'dialog-no-radius'],
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      autoFocus: false,
      disableClose: false,
    });
  }
  /**
   * HTTP REQ HANDLE
   */

  private getAllProducts() {
    // this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString(),
    };

    const mQuery = { ...{ productVisibility: true }, ...this.query };
  }

  private getAllCategory() {}

  private getAllBrands() {}

  private getAllSubCategory(categoryId: string) {}

  private getAllProductListBanner() {}

  /**
   * ON FILTER CHANGE
   */

  onFilterPriceRange() {
    if (!this.maxPrice) {
      this.maxPrice = this.priceRange.max;
    }

    if (this.query && this.query.price) {
      delete this.query.price;
    }
    const pQ = { price: { $gte: this.minPrice - 1, $lte: this.maxPrice + 1 } };

    this.query = { ...this.query, ...pQ };
    // console.log(this.query);

    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllProducts();
    }
  }
  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], { queryParams: { page: event } });
  }

  /**
   * SELECTION CHANGE
   * FILTER
   */

  onCatSelectionChange(event: MatRadioChange) {
    this.getAllSubCategory(event.value._id);
    if (this.query && this.query.subCategory) {
      delete this.query.subCategory;
    }
    this.query = { ...this.query, ...{ category: event.value._id } };
    // console.log(this.query);
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllProducts();
    }
  }

  onBrandSelectionChange(event: MatRadioChange) {
    if (this.query) {
      this.query = { ...this.query, ...{ brand: event.value._id } };
    } else {
      this.query = { brand: event.value._id };
    }
    // console.log(this.query);
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllProducts();
    }
  }

  onSubCatSelectionChange(event: MatRadioChange) {
    this.query = { ...this.query, ...{ subCategory: event.value._id } };
    // console.log(this.query);
    this.getAllProducts();
    if (this.currentPage > 1) {
      this.router.navigate([], { queryParams: { page: 1 } });
    } else {
      this.getAllProducts();
    }
  }

  /**
   * ON REMOVE
   */
  onClearFilter() {
    this.catFilter = null;
    this.brandFilter = null;
    this.subCatFilter = null;
    this.query = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.subCategories = [];
    this.router.navigate([], {
      queryParams: { page: null },
      queryParamsHandling: 'merge',
    });
    this.getAllProducts();
  }
  /**
   * CHANGE VIEW TYPE
   */
  onChangeViewType(type: string) {
    this.viewType = type;
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.subCat) {
      this.subCat.unsubscribe();
    }
    if (this.subSubCat) {
      this.subSubCat.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }

  onPriceRangeInput() {
    this.onFilterPriceRange();
  }
}
