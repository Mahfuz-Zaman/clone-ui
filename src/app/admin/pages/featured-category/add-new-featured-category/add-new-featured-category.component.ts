import {Component, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from '../../../../services/category.service';
import {ProductCategory} from '../../../../interfaces/product-category';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Product} from '../../../../interfaces/product';
import {FeaturedCategory} from '../../../../interfaces/featured-category';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FeaturedCategoryService} from '../../../../services/featured-category.service';
import {ProductTableComponent} from '../../components/product-table/product-table.component';
import {MatSelectChange} from '@angular/material/select';
import {ImageGalleryDialogComponent} from '../../image-gallery-dialog/image-gallery-dialog.component';

@Component({
  selector: 'app-add-new-featured-category',
  templateUrl: './add-new-featured-category.component.html',
  styleUrls: ['./add-new-featured-category.component.scss']
})
export class AddNewFeaturedCategoryComponent implements OnInit {

  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  private sub: Subscription;
  categories: ProductCategory[] = [];

  isLoading = false;

  // Store Data from param
  id?: string;
  products: Product[] = [];
  featuredCategory: FeaturedCategory = null;

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;
  pickedImage2?: string;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;

  pickedImageFor: string;
  bannerImage: boolean;


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
    private featuredCategoryService: FeaturedCategoryService
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      priority: [null],
      shortDesc: [null, Validators.required],
      category: [null, Validators.required],
      info: [null],
      image: [null],
      banner: [null],
      routerLink: [null, Validators.required],
      cardBackground: [null, Validators.required],
      cardBtnColor: [null, Validators.required],
      products: [null, Validators.required]
    });

    this.pickedImage = this.placeholder;
    this.pickedImage2 = this.placeholder;

    // Image From state
    if (!this.id) {
      // IF HAVE DATA ON SESSION
      if (this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT'));
      }
      if (this.dataForm.value.products && this.dataForm.value.products.length > 0) {
        this.getSpecificProductsById(this.dataForm.value.products);
      }
      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.pickedImage2 = history.state.images[0].url;
        this.dataForm.patchValue(
          {image: this.pickedImage, banner: this.pickedImage2}
        );
      }
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleFeaturedCategoryById();
      }
    });

    this.getAllCategory();
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.featuredCategory);

    if (this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('FEATURED_CATEGORY_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.pickedImage2 = history.state.images[1].url;
      this.dataForm.patchValue(
        {image: this.pickedImage, banner: this.pickedImage2}
      );
    } else {
      this.pickedImage = this.featuredCategory.image ? this.featuredCategory.image : this.placeholder;
      this.pickedImage2 = this.featuredCategory.banner ? this.featuredCategory.banner : this.placeholder;
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.featuredCategory ? this.products.map(m => m._id) : null,
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
      const finalData = {...this.dataForm.value, ...{_id: this.id}};
      this.editFeaturedCategory(finalData);
    } else {
      this.addNewDealOnPlay(this.dataForm.value);
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

  private addNewDealOnPlay(data: FeaturedCategory) {
    this.featuredCategoryService.addNewFeaturedCategory(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('FEATURED_CATEGORY_INPUT');
        this.pickedImage = this.placeholder;
        this.selectedProductIds = [];
        this.products = [];
      }, err => {
        console.log(err);
      });
  }

  private getSingleFeaturedCategoryById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.featuredCategoryService.getSingleFeaturedCategoryById(this.id, selectProductField)
      .subscribe(res => {
        this.featuredCategory = res.data;
        this.products = this.featuredCategory.products as Product[];
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  private editFeaturedCategory(data: FeaturedCategory) {
    this.featuredCategoryService.editFeaturedCategory(data)
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

  onCatSelect(event: MatSelectChange) {
    if (event.value) {
      const slug = this.categories.find(f => f._id === event.value).categorySlug;
      this.dataForm.patchValue(
        {routerLink: slug}
      );
      console.log(slug);
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentGallaryDialog(pickedImageFor: string) {
    this.pickedImageFor = pickedImageFor;
    console.log(this.pickedImageFor);
    const dialogRef = this.dialog.open(ImageGalleryDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          if (this.pickedImageFor === 'image'){
            this.pickedImage = dialogResult.data[0].url;
            this.dataForm.patchValue(
              {image: this.pickedImage}
            );
          }
          if (this.pickedImageFor === 'banner'){
            this.pickedImage2 = dialogResult.data[0].url;
            this.dataForm.patchValue(
              {banner: this.pickedImage2}
            );
          }
        }
      }
    });
  }

  /**
   * REMOVE SELECTED IMAGE
   */
  removeSelectImage() {
    this.pickedImage2 = this.placeholder ;
    this.dataForm.value.banner = null;
  }
}
