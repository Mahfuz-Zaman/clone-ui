import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpStatusCodeEnum} from '../../../../enum/http-status-code.enum';
import {Warranty} from '../../../../interfaces/warranty';
import {WarrantyService} from '../../../../services/warranty.service';

@Component({
  selector: 'app-add-new-warranty',
  templateUrl: './add-new-warranty.component.html',
  styleUrls: ['./add-new-warranty.component.scss']
})
export class AddNewWarrantyComponent implements OnInit, OnDestroy {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  warranty: Warranty;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private warrantyService: WarrantyService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      invoiceNumber: [null, Validators.required],
      activationDate: [null, Validators.required],
      warrantyPeriod: [null, Validators.required],
      productName: [null, Validators.required],
      sku: [null, Validators.required],
      customerName: [null, Validators.required],
      customerPhoneNo: [null, Validators.required],
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getWarrantyByWarrantyId();
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
        invoiceNumber: this.dataForm.value.invoiceNumber.trim(),
        activationDate: this.utilsService.getDateString(this.dataForm.value.activationDate)
      }
    };

    if (this.warranty) {
      this.editWarrantyData({...mData, ...{_id: this.warranty._id}});
    } else {
      this.addWarranty(mData);
    }

  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addWarranty(data: Warranty) {
    this.spinner.show();
    this.warrantyService.addWarranty(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        this.uiService.warn('This invoice number already exists');
        if (error.error.statusCode === HttpStatusCodeEnum.EXISTS_OR_NOT_ACCEPT) {
          this.dataForm.controls.invoiceNumber.setErrors({incorrect: true});
        }
      });
  }

  private getWarrantyByWarrantyId() {
    this.spinner.show();
    this.warrantyService.getWarrantyByWarrantyId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          this.warranty = res.data;
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editWarrantyData(data: Warranty) {
    this.spinner.show();
    this.warrantyService.editWarrantyData(data)
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
