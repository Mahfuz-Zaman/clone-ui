import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {ProductAttribute} from '../../../../interfaces/product-attribute';
import {AttributeService} from '../../../../services/attribute.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {CustomizationService} from '../../../../services/customization.service';
import {Carousel} from '../../../../interfaces/carousel';
import {NgxSpinnerService} from 'ngx-spinner';
import { ImageGalleryDialogComponent } from '../../image-gallery-dialog/image-gallery-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-carousel',
  templateUrl: './add-carousel.component.html',
  styleUrls: ['./add-carousel.component.scss'],
})
export class AddCarouselComponent implements OnInit, OnDestroy {
  dataForm: FormGroup;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  // Store Data from param
  id?: string;
  carousel: Carousel = null;

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;
  pickedImage2?: string;

  attributes: ProductAttribute[] = [];

  // Destroy Session
  needSessionDestroy = true;
  pickedImageFor: string;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private customizationService: CustomizationService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      url: [null, Validators.required],
      image: [null],
      mobileImage: [null],
    });

    this.pickedImage = this.placeholder;
    this.pickedImage2 = this.placeholder;

    // Image From state
    if (!this.id) {
      // IF HAVE DATA ON SESSION
      if (this.storageService.getStoredInput('CAROUSEL_INPUT')) {
        this.dataForm.patchValue(
          this.storageService.getStoredInput('CAROUSEL_INPUT')
        );
      }

      // Image From state
      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.pickedImage2 = history.state.images[0].url;
        this.dataForm.patchValue({
          image: this.pickedImage,
          mobileImage: this.pickedImage2,
        });
      }
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSingleCarouselById();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.carousel);

    if (this.storageService.getStoredInput('CAROUSEL_INPUT')) {
      this.dataForm.patchValue(
        this.storageService.getStoredInput('CAROUSEL_INPUT')
      );
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.pickedImage2 = history.state.images[1].url;
      this.dataForm.patchValue({
        image: this.pickedImage,
        mobileImage: this.pickedImage2,
      });
    } else {
      this.pickedImage = this.carousel.image
        ? this.carousel.image
        : this.placeholder;
      this.pickedImage2 = this.carousel.mobileImage
        ? this.carousel.mobileImage
        : this.placeholder;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    console.log('On Submit', this.dataForm.value);
    const mUrl = this.utilsService.urlToRouter(this.dataForm.value.url, true);
    const mData = { ...this.dataForm.value, ...{ url: mUrl } };

    if (this.id) {
      const finalData = { ...mData, ...{ _id: this.id } };
      this.editCarouselById(finalData);
    } else {
      this.addNewCarousel(mData);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'CAROUSEL_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewCarousel(data: Carousel) {
    this.spinner.show();
    this.customizationService.addNewCarousel(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('CAROUSEL_INPUT');
        this.pickedImage = this.placeholder;
        this.carousel = null;
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
  }

  private getSingleCarouselById() {
    this.spinner.show();
    this.customizationService.getSingleCarouselById(this.id).subscribe(
      (res) => {
        if (res.data) {
          this.carousel = res.data;
          this.setFormData();
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
        console.log(error);
      }
    );
  }

  private editCarouselById(data: Carousel) {
    this.spinner.show();
    this.customizationService.editCarouselById(data).subscribe(
      (res) => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('CAROUSEL_INPUT');
        this.spinner.hide();
      },
      (error) => {
        console.log(error);
        this.spinner.hide();
      }
    );
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
          if (this.pickedImageFor === 'mobileImage') {
            this.pickedImage2 = dialogResult.data[0].url;
            this.dataForm.patchValue({ mobileImage: this.pickedImage2 });
          }
        }
      }
    });
  }

  /**
   * REMOVE SELECTED IMAGE
   */
  removeSelectImage() {
    this.pickedImage2 = this.placeholder;
    this.dataForm.value.mobileImage = null;
  }

  ngOnDestroy() {
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('CAROUSEL_INPUT');
    }
  }
}
