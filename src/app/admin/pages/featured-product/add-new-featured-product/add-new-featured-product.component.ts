import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Product} from '../../../../interfaces/product';
import {FeaturedProduct} from '../../../../interfaces/featured-product';
import {FeaturedProductService} from '../../../../services/featured-product.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProductTableComponent} from '../../components/product-table/product-table.component';
import {Select} from '../../../../interfaces/select';

@Component({
  selector: 'app-add-new-featured-product',
  templateUrl: './add-new-featured-product.component.html',
  styleUrls: ['./add-new-featured-product.component.scss']
})
export class AddNewFeaturedProductComponent implements OnInit {
  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;
  // Featured Product Type
  featureProductTypes: Select[] = [
    {
      value: 'featured',
      viewValue: 'Featured',
    },
    {
      value: 'best-seller',
      viewValue: 'Best Seller',
    },
    {
      value: 'special-product',
      viewValue: 'Special Product',
    },
  ];

  dataForm: FormGroup;
  private sub: Subscription;

  isLoading = false;

  // Store Data from param
  id?: string;
  featuredProduct: FeaturedProduct = null;
  product?: Product;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private featuredProductService: FeaturedProductService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      type: [null, Validators.required],
      priority: [null],
      product: [null, Validators.required]
    });

    // IF HAVE DATA ON SESSION
    if (this.storageService.getStoredInput('FEATURED_PRODUCT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('FEATURED_PRODUCT'));
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleFeaturedProductById();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.featuredProduct);

    if (this.storageService.getStoredInput('FEATURED_PRODUCT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('FEATURED_PRODUCT'));
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.featuredProduct ? [this.product._id] : null,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      height: '90vh',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.selectedIds) {
          this.selectedProductIds = dialogResult.selectedIds;
          this.dataForm.patchValue({product: this.selectedProductIds[0]});
          this.getSpecificProductsById(this.selectedProductIds);
        }
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.id) {
      const finalData = {...this.dataForm.value, ...{_id: this.id}};
      this.editFeaturedProduct(finalData);
    } else {
      this.addNewFeaturedProduct(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'FEATURED_PRODUCT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
  private addNewFeaturedProduct(data: FeaturedProduct) {
    this.featuredProductService.addNewFeaturedProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('FEATURED_PRODUCT');
        // this.pickedImage = this.placeholder;
        this.selectedProductIds = [];
        this.product = undefined;
      }, err => {
        console.log(err);
      });
  }

  private getSingleFeaturedProductById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.featuredProductService.getSingleFeaturedProductById(this.id, selectProductField)
      .subscribe(res => {
        this.featuredProduct = res.data;
        // console.log(res.data);
        this.product = this.featuredProduct.product as Product;
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }


  private editFeaturedProduct(data: FeaturedProduct) {
    this.featuredProductService.editFeaturedProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('DEALS_OF_THE_DAY');
      }, err => {
        console.log(err);
      });
  }

  private getSpecificProductsById(ids: string[]) {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.subProduct = this.productService.getSpecificProductsById(ids, selectProductField)
      .subscribe(res => {
        this.product = res.data[0];
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('DEALS_OF_THE_DAY');
    }
  }
}
