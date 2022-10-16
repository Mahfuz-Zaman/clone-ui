import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ProductCategory } from 'src/app/interfaces/product-category';
import { PromoBanner } from 'src/app/interfaces/promo-banner';
import { CategoryService } from 'src/app/services/category.service';
import { PromoBannerService } from 'src/app/services/promo-banner.service';
import { ReloadService } from 'src/app/services/reload.service';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/ui/confirm-dialog/confirm-dialog.component';
import { ImageGalleryDialogComponent } from '../image-gallery-dialog/image-gallery-dialog.component';

@Component({
  selector: 'app-product-promo-banner',
  templateUrl: './product-promo-banner.component.html',
  styleUrls: ['./product-promo-banner.component.scss'],
})
export class ProductPromoBannerComponent implements OnInit, OnDestroy {
  private subDataThree?: Subscription;

  dataForm?: FormGroup;

  isLoading = false;
  update = false;
  // Store Data from param
  id?: string;
  promoBanner: PromoBanner;
  categories: ProductCategory[] = [];
  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;
  pickedImage2?: string;
  pickedImageMobile?: string;

  // // Destroy Session
  needSessionDestroy = true;
  pickedImageFor: string;
  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    public router: Router,
    private promoBannerService: PromoBannerService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private reloadService: ReloadService
  ) {}

  ngOnInit(): void {
    this.reloadService.refreshPromoPage$.subscribe(() => {
      this.getPromoBanner();
    });

    // INIT FORM
    this.initFormGroup();

    this.pickedImage = this.placeholder;
    // this.pickedImage2 = this.placeholder;

    // Image From state
    if (!this.id) {
      if (this.storageService.getStoredInput('PROMO_BANNER_INPUT')) {
        this.dataForm.patchValue(
          this.storageService.getStoredInput('PROMO_BANNER_INPUT')
        );
      }

      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        // this.pickedImage2 = history.state.images[0].url;
        this.dataForm.patchValue({
          image: this.pickedImage,
          // mobileImage: this.pickedImage2,
        });
      }
      this.getAllCategory();
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getPromoBannerByID();
      }
    });

    // GET DATA
    this.getPromoBanner();

    this.setFormData();
  }
  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      image: [null, Validators.required],
      // mobileImage: [null, Validators.required],
      routerLink: [null, Validators.required],
      category: [null, Validators.required],
    });
  }

  // /**
  //  * SET FORM DATA
  //  */
  private setFormData() {
    this.dataForm.patchValue(this.promoBanner);

    if (this.storageService.getStoredInput('PROMO_BANNER_INPUT')) {
      this.dataForm.patchValue(
        this.storageService.getStoredInput('PROMO_BANNER_INPUT')
      );
    }
      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        // this.pickedImage2 = history.state.images[1].url;
        this.dataForm.patchValue({
          image: this.pickedImage,
          // mobileImage: this.pickedImage2,
        });
      } else {
        this.pickedImage = this.promoBanner.image
          ? this.promoBanner.image
          : this.placeholder;
        // this.pickedImage2 = this.promoBanner.mobileImage
        //   ? this.promoBanner.mobileImage
        //   : this.placeholder;
      }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(
      this.dataForm?.value,
      'PROMO_BANNER_INPUT'
    );
  }
  onHoldMobileInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(
      this.dataForm?.value,
      'PROMO_BANNER_INPUT'
    );
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    console.log('On Submit', this.dataForm.value);

    if (this.promoBanner) {
      const finalData = {
        ...this.dataForm.value,
        ...{ _id: this.promoBanner._id },
      };
      this.editPromoBanner(finalData);
    } else {
      this.addPromoBanner(this.dataForm.value);
    }
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
  private getAllCategory() {
    this.subDataThree = this.categoryService.getAllCategory().subscribe(
      (res) => {
        this.categories = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  private getPromoBannerByID() {
    this.spinner.show();
    this.promoBannerService.getPromoBannerByID(this.id).subscribe(
      (res) => {
        this.promoBanner = res.data;
        if (this.promoBanner) {
          this.setFormData();
        }
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private editPromoBanner(data: PromoBanner) {
    this.spinner.show();
    this.promoBannerService.editPromoBanner(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMO_BANNER_INPUT');
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  private addPromoBanner(data: any) {
    this.spinner.show();
    this.promoBannerService.addPromoBanner(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.storageService.removeSessionData('PROMO_BANNER_INPUT');
        this.reloadService.needRefreshPromoPage$();
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  private getPromoBanner() {
    this.spinner.show();
    this.promoBannerService.getPromoBanner().subscribe(
      (res) => {
        this.spinner.hide();
        if (res.data) {
          this.promoBanner = res.data;
          this.pickedImage = res.data?.image;
          // this.pickedImageMobile = res.data?.mobileImage;
          this.dataForm.patchValue(this.promoBanner);
        }
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  private updatePromoPageInfo(data: PromoBanner) {
    this.spinner.show();
    this.promoBannerService.updatePromoBannerInfo(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMO_BANNER_INPUT');
        this.reloadService.needRefreshPromoPage$();
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  private deletePromoBanner(id: string) {
    this.spinner.show();
    this.promoBannerService.deletePromoBanner(id).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMO_BANNER_INPUT');
        this.pickedImage = this.placeholder;
        this.pickedImageMobile = this.placeholder;
        this.promoBanner = null;
        this.dataForm.reset();
        this.reloadService.needRefreshPromoPage$();
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this Promo Banner?',
      },
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.deletePromoBanner(this.promoBanner?._id);
      }
    });
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
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          if (this.pickedImageFor === 'image') {
            this.pickedImage = dialogResult.data[0].url;
            this.dataForm.patchValue({ image: this.pickedImage });
          }
          // if (this.pickedImageFor === 'mobileImage') {
          //   this.pickedImage2 = dialogResult.data[0].url;
          //   this.dataForm.patchValue({ mobileImage: this.pickedImage2 });
          // }
        }
      }
    });
  }
  public showupdate() {
    if (this.update) {
      this.update = false;
    } else {
      this.update = true;
    }
  }
  /**
   * REMOVE SELECTED IMAGE
   */
  removeSelectImage() {
    // this.pickedImage2 = this.placeholder;
    // this.dataForm.value.mobileImage = null;
  }
  ngOnDestroy() {
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('PROMO_BANNER_INPUT');
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }
  }
}
