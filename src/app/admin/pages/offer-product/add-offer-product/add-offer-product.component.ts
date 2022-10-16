import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ProductCategory} from '../../../../interfaces/product-category';
import {PromotionalOffer} from '../../../../interfaces/promotional-offer';
import {Product} from '../../../../interfaces/product';
import {OfferProduct} from '../../../../interfaces/offer-product';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CategoryService} from '../../../../services/category.service';
import {OfferProductService} from '../../../../services/offer-product.service';
import {PromotionalOfferService} from '../../../../services/promotional-offer.service';
import {MatSelectChange} from '@angular/material/select';
import {ProductTableComponent} from '../../components/product-table/product-table.component';
import {AngularEditorConfig} from '@kolkov/angular-editor';
import {MatCheckboxChange} from '@angular/material/checkbox';

@Component({
  selector: 'app-add-offer-product',
  templateUrl: './add-offer-product.component.html',
  styleUrls: ['./add-offer-product.component.scss']
})
export class AddOfferProductComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  dataForm: FormGroup;
  private sub: Subscription;
  categories: ProductCategory[] = [];
  promotionalOffers: PromotionalOffer[] = [];

  // Store Data from param
  id?: string;
  products: Product[] = [];
  offerProduct: OfferProduct = null;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;
  promotionalOfferSlug: string = null;

  editorConfigDesc: AngularEditorConfig = {
    editable: true,
    minHeight: '250px',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter/Copy product descriptions...',
    sanitize: false,
    toolbarPosition: 'top',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
  };


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private categoryService: CategoryService,
    private promotionalOfferService: PromotionalOfferService,
    private offerProductService: OfferProductService
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      category: [null],
      promotionalOffer: [null, Validators.required],
      promotionalOfferSlug: [null],
      description: [null],
      products: [null, Validators.required]
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleOfferProductById();
      }
    });

    this.getAllCategory();
    this.getAllPromotionalOffer();
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.offerProduct);

    if (this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT'));
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.offerProduct ? this.products.map(m => m._id) : null,
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
          this.dataForm.patchValue({products: dialogResult.selectedIds});
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
      // console.log('slug', this.promotionalOfferSlug);
      const finalData = {...this.dataForm.value, ...{_id: this.id}};
      // console.log('$$$$$$$$$$$$', finalData);
      this.editOfferProduct(finalData);
    } else {
      this.addNewOfferProduct({...this.dataForm.value, ...{promotionalOfferSlug: this.promotionalOfferSlug}});
    }

  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'FEATURED_CATEGORY_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
  private getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllPromotionalOffer() {
    this.promotionalOfferService.getAllPromotionalOffer()
      .subscribe(res => {
        this.promotionalOffers = res.data;
      }, error => {
        console.log(error);
      });
  }

  private addNewOfferProduct(data: OfferProduct) {
    this.offerProductService.addNewOfferProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('FEATURED_CATEGORY_INPUT');
        this.selectedProductIds = [];
        this.products = [];
      }, err => {
        console.log(err);
      });
  }

  private getSingleOfferProductById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.offerProductService.getSingleOfferProductById(this.id, selectProductField)
      .subscribe(res => {
        this.offerProduct = res.data;
        this.products = this.offerProduct.products as Product[];
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }


  private editOfferProduct(data: OfferProduct) {
    // console.log('*******', data);
    this.offerProductService.editOfferProduct(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('FEATURED_CATEGORY_INPUT');
      }, err => {
        console.log(err);
      });
  }
  private getSpecificProductsById(ids: string[]) {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.subProduct = this.productService.getSpecificProductsById(ids, selectProductField)
      .subscribe(res => {
        this.products = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  onCatSelect(event: MatSelectChange) {
    if (event.value) {
      const slug = this.categories.find(f => f._id === event.value).categorySlug;
      this.dataForm.patchValue(
        {routerLink: slug}
      );
    }
  }

  onProOfferSelect(event: MatSelectChange) {
    if (event.value) {
      const slug = this.promotionalOffers.find(f => f._id === event.value).slug;
      this.dataForm.patchValue(
        {routerLink: slug}
      );
      this.promotionalOfferSlug = slug;
    }
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
      this.storageService.removeSessionData('FEATURED_CATEGORY_INPUT');
    }
  }

  removeProduct(index: number) {
    this.products.splice(index, 1);
    this.dataForm.patchValue({products: this.products});
  }
}
