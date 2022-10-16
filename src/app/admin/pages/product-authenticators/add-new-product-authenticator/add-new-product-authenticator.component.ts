import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProductAuthenticator} from '../../../../interfaces/product-authenticator';
import {ProductAuthenticatorService} from '../../../../services/product-authenticator.service';

@Component({
  selector: 'app-add-new-product-authenticator',
  templateUrl: './add-new-product-authenticator.component.html',
  styleUrls: ['./add-new-product-authenticator.component.scss']
})
export class AddNewProductAuthenticatorComponent implements OnInit, OnDestroy {

// Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  productAuthenticator: ProductAuthenticator;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private productAuthenticatorService: ProductAuthenticatorService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      imei: [null],
      sn: [null]
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getProductAuthenticatorById();
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (!this.dataForm.value.imei.trim() && !this.dataForm.value.sn.trim()) {
      this.uiService.warn('Please complete at least one field');
      return;
    }

    // console.log(this.dataForm.value);

    const mData = {
      imei: this.dataForm.value.imei.trim(),
      sn: this.dataForm.value.sn.trim()
    };

    if (this.productAuthenticator) {
      this.editProductAuthenticatorData({...mData, ...{_id: this.productAuthenticator._id}});
    } else {
      this.addProductAuthenticator(mData);
    }

  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addProductAuthenticator(data: ProductAuthenticator) {
    this.spinner.show();
    this.productAuthenticatorService.addProductAuthenticator(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.uiService.warn('This imei or sn already exists');
      });
  }

  private getProductAuthenticatorById() {
    this.spinner.show();
    this.productAuthenticatorService.getProductAuthenticatorById(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          this.productAuthenticator = res.data;
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editProductAuthenticatorData(data: ProductAuthenticator) {
    this.spinner.show();
    this.productAuthenticatorService.editProductAuthenticatorData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  ngOnDestroy() {

  }

}
