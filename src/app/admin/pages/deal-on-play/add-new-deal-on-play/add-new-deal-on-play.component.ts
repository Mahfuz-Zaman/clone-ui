import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {ProductTableComponent} from '../../components/product-table/product-table.component';
import {MatDialog} from '@angular/material/dialog';
import {DealOnPlayService} from '../../../../services/deal-on-play.service';
import {DealOnPlay} from '../../../../interfaces/deal-on-play';
import {environment} from '../../../../../environments/environment';
import {Product} from '../../../../interfaces/product';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-deal-on-play.component.html',
  styleUrls: ['./add-new-deal-on-play.component.scss']
})
export class AddNewDealOnPlayComponent implements OnInit, OnDestroy {

  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;


  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  autoSlug = true;

  dataForm: FormGroup;
  private sub: Subscription;

  isLoading = false;

  // Store Data from param
  id?: string;
  dealOnPlay: DealOnPlay = null;
  products: Product[] = [];

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;


  constructor(
    private fb: FormBuilder,
    private dealOnPlayService: DealOnPlayService,
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
      name: [null, Validators.required],
      slug: [null, Validators.required],
      priority: [null],
      shortDesc: [null, Validators.required],
      info: [null],
      image: [null],
      routerLink: [null, Validators.required],
      cardBackground: [null, Validators.required],
      cardBtnColor: [null, Validators.required],
      products: [null, Validators.required]
    });

    this.autoGenerateSlug();


    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {
      // IF HAVE DATA ON SESSION
      if (this.storageService.getStoredInput('DEAL_ON_PLAY_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('DEAL_ON_PLAY_INPUT'));
      }
      if (this.dataForm.value.products && this.dataForm.value.products.length > 0) {
        this.getSpecificProductsById(this.dataForm.value.products);
      }
      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.dataForm.patchValue(
          {image: this.pickedImage}
        );
      }
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleDealOnPlayById();
      }
    });

  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.dealOnPlay);

    if (this.storageService.getStoredInput('DEAL_ON_PLAY_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('DEAL_ON_PLAY_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.dealOnPlay.image ? this.dealOnPlay.image : this.placeholder;
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.dealOnPlay ? this.products.map(m => m._id) : null,
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
      this.editDealOnPlay(finalData);
    } else {
      this.addNewDealOnPlay(this.dataForm.value);
    }

  }


  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('name').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'DEAL_ON_PLAY_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewDealOnPlay(data: DealOnPlay) {
    this.dealOnPlayService.addNewDealOnPlay(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('DEAL_ON_PLAY_INPUT');
        this.pickedImage = this.placeholder;
        this.selectedProductIds = [];
        this.products = [];
      }, err => {
        console.log(err);
      });
  }

  private editDealOnPlay(data: DealOnPlay) {
    this.dealOnPlayService.editDealOnPlay(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('DEAL_ON_PLAY_INPUT');
      }, err => {
        console.log(err);
      });
  }

  private getSingleDealOnPlayById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.dealOnPlayService.getSingleDealOnPlayById(this.id, selectProductField)
      .subscribe(res => {
        this.dealOnPlay = res.data;
        this.products = this.dealOnPlay.products as Product[];
        this.setFormData();
      }, error => {
        console.log(error);
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


  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('DEAL_ON_PLAY_INPUT');
    }
  }

}
