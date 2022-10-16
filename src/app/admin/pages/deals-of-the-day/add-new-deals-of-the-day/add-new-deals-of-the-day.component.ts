import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {Product} from '../../../../interfaces/product';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DealsOfTheDayService} from '../../../../services/deals-of-the-day.service';
import {DealsOfTheDay} from '../../../../interfaces/deals-of-the-day';
import {ProductTableComponent} from '../../components/product-table/product-table.component';
import {UtilsService} from '../../../../services/utils.service';
import {Editor} from 'ngx-editor';
import {AngularEditorConfig} from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-new-deals-of-the-day',
  templateUrl: './add-new-deals-of-the-day.component.html',
  styleUrls: ['./add-new-deals-of-the-day.component.scss']
})
export class AddNewDealsOfTheDayComponent implements OnInit {


  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  private sub: Subscription;

  isLoading = false;
  autoSlug = true;

  // Store Data from param
  id?: string;
  dealsOfTheDay: DealsOfTheDay = null;
  product?: Product;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;

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
    private dealsOfTheDayService: DealsOfTheDayService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {



    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null, Validators.required],
      desc: [null],
      startDate: [null],
      endDate: [null, Validators.required],
      priority: [null],
      product: [null, Validators.required]
    });
    // IF HAVE DATA ON SESSION
    if (this.storageService.getStoredInput('DEALS_OF_THE_DAY')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('DEALS_OF_THE_DAY'));
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleDealsOfTheDayById();
      }
    });

    this.autoGenerateSlug();

  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.dealsOfTheDay);
    this.dataForm.patchValue({startDate: new Date(this.dealsOfTheDay.startDate), endDate: new Date(this.dealsOfTheDay.endDate)});

    if (this.storageService.getStoredInput('DEALS_OF_THE_DAY')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('DEALS_OF_THE_DAY'));
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.dealsOfTheDay ? [this.product._id] : null,
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

    const mData = {
      ...this.dataForm.value,
      ...{
        startDate: this.utilsService.getDateString(this.dataForm.value.startDate, 'LL'),
        endDate: this.utilsService.getDateString(this.dataForm.value.endDate, 'LL'),
      }
    };
    if (this.id) {
      const finalData = {...mData, ...{_id: this.id}};
      // console.log(finalData);
      this.editDealsOfTheDay(finalData);
    } else {
      this.addNewDealsOfTheDay(mData);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'DEALS_OF_THE_DAY');
  }



  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('name').valueChanges
        .pipe(
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
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
  private addNewDealsOfTheDay(data: DealsOfTheDay) {
    this.dealsOfTheDayService.addNewDealsOfTheDay(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('DEALS_OF_THE_DAY');
        // this.pickedImage = this.placeholder;
        this.selectedProductIds = [];
        this.product = undefined;
      }, err => {
        console.log(err);
      });
  }
  private getSingleDealsOfTheDayById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.dealsOfTheDayService.getSingleDealsOfTheDayById(this.id, selectProductField)
      .subscribe(res => {
        this.dealsOfTheDay = res.data;
        // console.log(res.data);
        this.product = this.dealsOfTheDay.product as Product;
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  private editDealsOfTheDay(data: DealsOfTheDay) {
    this.dealsOfTheDayService.editDealsOfTheDay(data)
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
  // desc: Editor;
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
