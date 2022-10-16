import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpStatusCodeEnum} from '../../../../enum/http-status-code.enum';
import {CertificateVerification} from '../../../../interfaces/certificate-verification';
import {CertificateVerificationService} from '../../../../services/certificate-verification.service';
import {Router} from "@angular/router"
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-new-certificate',
  templateUrl: './add-new-certificate.component.html',
  styleUrls: ['./add-new-certificate.component.scss']
})
export class AddNewCertificateComponent implements OnInit,OnDestroy {

  // Subscription
  private subActivatedRoute : Subscription;
  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  certificate: CertificateVerification;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private certificateVerificationService: CertificateVerificationService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      certificateNumber: [null, Validators.required],
      storeName: [null, Validators.required],
      dealerName: [null, Validators.required],
      address: [null, Validators.required],
      phoneNo: [null, Validators.required],
      validity: [null, Validators.required],
    });

    // GET ID FORM PARAM
    this.subActivatedRoute = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCertificateByCertificateId();
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
        certificateNumber: this.dataForm.value.certificateNumber.trim(),
        validity: this.utilsService.getDateString(this.dataForm.value.validity)
      }
    };

    if (this.certificate) {
      this.editCertificateData({...mData, ...{_id: this.certificate._id}});
    } else {
      this.addCertificate(mData);
    }
    // console.log('this.dataForm.value',this.dataForm.value);
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */


   private addCertificate(data: CertificateVerification) {
    this.spinner.show();
    this.certificateVerificationService.addCertificate(data)
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

   private getCertificateByCertificateId() {
    this.spinner.show();
    this.certificateVerificationService.getCertificateByCertificateId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          // console.log('patchValue',res.data);
          this.certificate = res.data;
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editCertificateData(data: CertificateVerification) {
    this.spinner.show();
    this.certificateVerificationService.editCertificateData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.router.navigate(['admin/certificate-verification']);
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  ngOnDestroy() {
    if (this.subActivatedRoute) {
      this.subActivatedRoute.unsubscribe();
    }
  }
}
