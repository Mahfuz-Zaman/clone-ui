import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {Product} from '../../../interfaces/product';
import {ProductCategory} from '../../../interfaces/product-category';
import {ProductSubCategory} from '../../../interfaces/product-sub-category';
import {Select} from '../../../interfaces/select';
import {NgForm} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {ProductService} from '../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../services/utils.service';
import {Pagination} from '../../../interfaces/pagination';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-best-sells-products',
  templateUrl: './best-sells-products.component.html',
  styleUrls: ['./best-sells-products.component.scss']
})
export class BestSellsProductsComponent implements OnInit, OnDestroy {

  // Subscriptions
  private subProduct: Subscription;
  private subCat: Subscription;
  private subSubCat: Subscription;
  private subAcRoute: Subscription;
  private subForm: Subscription;

  // Store Data
  products: Product[] = [];
  products2: Product[] = [];
  private holdPrevData: any[] = [];
  categories: ProductCategory[] = [];
  subCategories: ProductSubCategory[] = [];
  stockTypes: Select[] = [
    {value: {quantity: {$gt: 0}}, viewValue: 'Stock In'},
    {value: {quantity: {$lte: 0}}, viewValue: 'Stock Out'},
  ];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: Product[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Select View Child
  @ViewChild('matCatSelect') matCatSelect: MatSelect;
  @ViewChild('matSubCatSelect') matSubCatSelect: MatSelect;

  // DOWNLOADABLE
  dataTypeFormat = 'excel';

  constructor(
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getProductsByDynamicSort();
    });
  }


  /**
   * HTTP REQ
   */

  private getProductsByDynamicSort() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    const sort = {
      deliveredQuantity: -1
    };

    const select = '-emiStatus -warrantyPolicy -paymentPolicy -deliveryPolicy -filterData -ratingReview -description -shortDescription -warrantyServices -attributes';

    this.subProduct = this.productService.getProductsByDynamicSort(pagination, sort, null, select)
      .subscribe(res => {
        // this.products = res.data;
        this.products = res.data.filter(item => item.deliveredQuantity && item.deliveredQuantity > 0);
        this.holdPrevData = res.data;
        this.totalProducts = res.count;
        this.totalProductsStore = res.count;
        this.spinner.hide();

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

  exportDataToFile() {
    if (this.dataTypeFormat === 'excel') {
      this.exportToExcel();
    }
  }

  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel() {
    this.spinner.show();
    const sort = {
      soldQuantity: -1
    };
    const select = '-emiStatus -warrantyPolicy -paymentPolicy -deliveryPolicy -filterData -ratingReview -description -shortDescription -warrantyServices -attributes';

    this.productService.getProductsByDynamicSort(null, sort, null, select)
      .subscribe(res => {
        const allData = res.data as Product[];
        const mData = allData.map(m => {
          return {
            _id: m._id,
            productName: m.productName,
            sku: m.sku,
            price: m.price,
            discountType: m.discountType,
            discountAmount: m.discountAmount,
            soldQuantity: m.soldQuantity,
            quantity: m.quantity
          };
        });

        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'products');
        XLSX.writeFile(wb, `Best_Sold_Products_${date}.xlsx`);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
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

}
