import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Pagination} from '../../interfaces/pagination';
import {Breadcrumb} from '../../interfaces/breadcrumb';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {CategoryService} from '../../services/category.service';
import {TagService} from '../../services/tag.service';
import {BrandService} from '../../services/brand.service';
import {SubCategoryService} from '../../services/sub-category.service';
import {AttributeService} from '../../services/attribute.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSliderChange} from '@angular/material/slider';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-brand-product-list',
  templateUrl: './brand-product-list.component.html',
  styleUrls: ['./brand-product-list.component.scss']
})
export class BrandProductListComponent implements OnInit {

  // SUBSCRIPTION
  querySubscribe: Subscription = null;
  paramSubscribe: Subscription = null;
  private subProductService : Subscription;
  private subProductServiceOne : Subscription;
  private subProductServiceTwo : Subscription;
  private subTagService : Subscription;
  private subCategoryServ : Subscription;
  private subSubCategoryService : Subscription;


  attributes: any[] = [];
  products: any[] = [];
  tags: any[] = [];

  // View Type
  viewType = 'grid';

  // Params
  categorySlug: string = null;
  subCategorySlug: string = null;
  brandSlug: string = null;
  tagId: string = null;
  tagSlug: string = null;
  brandId: string = null;
  tagsDetails : any = null;

  // Price Range
  minPrice: number = null;
  maxPrice: number = null;
  rangeSet = false;
  priceRange: { min: number; max: number } = {min: 0, max: 0};
  minView = 0;
  maxView = 0;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 12;

  query: any[] = [];
  query2: any[] = [];
  query3: any[] = [];
  // {
  //   pageSize: this.productsPerPage,
  //   currentPage: this.currentPage
  // }
  paginate: Pagination = null;
  select = 'productName images productSlug price discountType ratingReview discountAmount category brandSlug categorySlug brand sku subCategorySlug tags quantity campaignStartDate campaignEndDate campaignStartTime campaignEndTime';

  // MOBILE FILTER DIALOG
  @ViewChild('dialogFilter') dialogFilter: any;

  // Breadcrumb
  breadcrumbs: Breadcrumb[] = [];


  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private tagService: TagService,
    private brandService: BrandService,
    private subCategoryService: SubCategoryService,
    private attributeService: AttributeService,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {


    // PARAM SUBSCRIBE
    this.paramSubscribe = this.activatedRoute.paramMap.subscribe(param => {

      if (param.get('tagId')) {
        this.tagId = param.get('tagId');
        this.query.push({tags: {$in: this.tagId}});
      }
      else {
        if (param.get('brandSlug')) {
          this.brandSlug = param.get('brandSlug');
          this.query.push({brandSlug: this.brandSlug});
          // this.getBrandAttributes();
        }
        // if (param.get('tagSlug')) {
        //   this.tagSlug = param.get('tagSlug');
        //   this.query = [{tagSlug: this.tagSlug}];
        //   this.getTagAttributes();
        // }
        // if (param.get('categorySlug')) {
        //   this.categorySlug = param.get('categorySlug');
        //   this.query = [{categorySlug: this.categorySlug}];
        //   this.getCategoryAttributes();
        // }
        // if (param.get('subCategorySlug')) {
        //   this.subCategorySlug = param.get('subCategorySlug');
        //   this.query.push({subCategorySlug: this.subCategorySlug});
        //   this.getSubCategoryAttributes();
        // }
      }

      this.updateBreadcrumb();

      // QUERY SUBSCRIBE
      this.querySubscribe = this.activatedRoute.queryParams.subscribe(param2 => {

        if (param2.page) {
          this.currentPage = param2.page;
        } else {
          this.currentPage = 1;
        }
        this.productFilterByQuery(this.query);

      });


    });

    // // this.getAllProduct();
    // this.productFilterByQuery(this.query);
    // console.log(this.router.url);
  }

  /**
   * PRICE RANGE
   */

  onInputChangeMin(event: MatSliderChange) {
    this.router.navigate([], {queryParams: {page: 1}});
    setTimeout(() => {
      this.rangeSet = true;
      this.minPrice = event.value;
      this.onFilterPriceRange();
    }, 500);

  }

  onInputChangeMax(event: MatSliderChange) {
    this.router.navigate([], {queryParams: {page: 1}});
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

  private getAllProduct() {
    const pagination: Pagination = {
      currentPage: String(this.currentPage),
      pageSize: String(this.productsPerPage)
    };
    this.subProductService = this.productService.getAllProducts(pagination)
      .subscribe(res => {
        this.products = res.data;
        this.totalProducts = res.count;
        // const min = res.priceRange.minPrice;
        // const max = res.priceRange.maxPrice;
        if (this.totalProducts > 0) {
          this.priceRange.min = res.priceRange.minPrice;
          this.priceRange.max = res.priceRange.maxPrice;
          this.minView = res.priceRange.minPrice;
          this.maxView = res.priceRange.maxPrice;
        }
        // console.log(this.products);
      }, error => {
        console.log(error);
      });
  }

  private productFilterByQuery(query: any) {
    this.paginate = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    query.push({productVisibility: true});
    this.subProductServiceOne = this.productService.productFilterByQuery(query, this.paginate, this.select)
      .subscribe(res => {
        this.products = res.data;
        // console.log('Query Products:', this.products);
        this.totalProducts = res.count;
        // const min = res.priceRange.minPrice;
        // const max = res.priceRange.maxPrice;
        if (this.totalProducts > 0) {
          this.priceRange.min = res.priceRange.minPrice;
          this.priceRange.max = res.priceRange.maxPrice;
        }
        // console.log(this.products);
      }, error => {
        console.log(error);
      });
  }

  // private getTagAttributes(){
  //   this.subTagService = this.tagService.getTagByTagSlug(this.tagSlug)
  //     .subscribe(res => {
  //       this.tagsDetails = res.data;
  //
  //       // console.log('Tags:',res.data);
  //
  //       this.subProductServiceTwo = this.productService.getProductsByTagId(this.tagsDetails._id)
  //         .subscribe(res => {
  //           this.products = res.data;
  //
  //           // console.log('Tags products:',this.products);
  //           // console.log(this.attributes);
  //
  //         }, error => {
  //           console.log(error);
  //         });
  //
  //     }, error => {
  //       console.log(error);
  //     });
  // }
  private getCategoryAttributes() {
    this.subCategoryServ = this.categoryService.getCategoryByCategorySlug(this.categorySlug)
      .subscribe(res => {
        this.attributes = res.data.attributes;

      }, error => {
        console.log(error);
      });
  }

  // private getBrandAttributes() {
  //   this.brandService.getBrandByBrandID(this.brandSlug)
  //     .subscribe(res => {
  //       this.attributes = res.data;
  //
  //       console.log(this.attributes);
  //       // console.log(this.attributes);
  //
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  private getSubCategoryAttributes() {
    this.subSubCategoryService = this.subCategoryService.getSubCategoryBySubCategorySlug(this.subCategorySlug)
      .subscribe(res => {
        this.attributes = res.data.attributes;
        // console.log(this.attributes);
      }, error => {
        console.log(error);
      });
  }

  // private getAttributes() {
  //   this.attributeService.getAttributesByAttributeIds(this.subCategorySlug)
  //     .subscribe(res => {
  //       this.attributes = res.data;
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  /**
   * ON FILTER CHANGE
   */

  onFilterPriceRange() {
    this.query.forEach((item, index) => {
      if ('price' in item) {
        this.query.splice(index, 1);
      }
      ;
    });
    if (!this.maxPrice) {
      // console.log('Price is null');
      this.maxPrice = this.priceRange.max;
    }
    // console.log(this.minPrice);
    // console.log(this.maxPrice);

    // @ts-ignore
    this.query.push({'price': {'$gte': this.minPrice - 1, '$lte': this.maxPrice + 1}});
    // this.query3 = this.query3.concat(this.query);
    // console.log(this.query3);


    this.productFilterByQuery(this.query);

  }

  onFilterChange(event: MatCheckboxChange, a: any, v: any) {
    console.log(a.attributeName, v, event.checked);
    if (event.checked) {
      this.query2.push(
        {attributeName: a.attributeName, attributeValues: v}
        // {'attributes': {'$elemMatch': {'attributeName': a.attributeName, 'attributeValues': v}}}
      );
    } else {
      this.query2 = this.query2.filter((item) =>
        item.attributeValues != v
      );
    }
    const finalQuery = [];
    this.query2.map(item => {
      finalQuery.push(
        {
          $and: [
            {'filterData': {'$elemMatch': {'attributeName': item.attributeName}}},
            {'filterData': {'$elemMatch': {'attributeValues': item.attributeValues}}}
          ]
        }
      );
    });

    const temp = [{$or: finalQuery}];
    this.query3 = this.query.concat(temp);

    if (this.query2.length < 1) {
      this.productFilterByQuery(this.query);
    } else {
      this.productFilterByQuery(this.query3);
    }

  }


  /**
   * NGX PAGINATION CHANGED
   */

  public onChangePage(event: number) {
    this.router.navigate([], {queryParams: {page: event}});
    // this.router.navigate([], {queryParams: {page: 1}});
  }


  /**
   * Breadcrumb CUSTOM
   */
  private updateBreadcrumb() {
    if (this.subCategorySlug) {
      this.breadcrumbs = [
        {
          label: 'Home',
          url: '/',
          icon: 'fas fa-home'
        },
        {
          label: this.categorySlug,
          url: `/product-list/${this.categorySlug}`
        },
        {
          label: this.subCategorySlug,
          url: `/product-list/${this.categorySlug}/${this.subCategorySlug}`
        }
      ];
    } else if (this.categorySlug && !this.subCategorySlug) {
      this.breadcrumbs = [
        {
          label: 'Home',
          url: '/',
          icon: 'fas fa-home'
        },
        {
          label: this.categorySlug,
          url: `/product-list/${this.categorySlug}`
        }
      ];
    } else {
      this.breadcrumbs = [
        {
          label: 'Home',
          url: '/',
          icon: 'fas fa-home'
        }
      ];
    }
  }

  /**
   * CHANGE VIEW TYPE
   */
  onChangeViewType(type: string) {
    this.viewType = type;
  }

  ngOnDestroy(): void {
    if (this.paramSubscribe) {
      this.paramSubscribe.unsubscribe();
    }
    if (this.querySubscribe) {
      this.querySubscribe.unsubscribe();
    }
    if (this.subCategoryServ) {
      this.subCategoryServ.unsubscribe();
    }
    if (this.subSubCategoryService) {
      this.subSubCategoryService.unsubscribe();
    }
    if (this.subSubCategoryService) {
      this.subSubCategoryService.unsubscribe();
    }
    if (this.subProductService) {
      this.subProductService.unsubscribe();
    }
    if (this.subProductServiceOne) {
      this.subProductServiceOne.unsubscribe();
    }
    if (this.subProductServiceTwo) {
      this.subProductServiceTwo.unsubscribe();
    }
  }

}
