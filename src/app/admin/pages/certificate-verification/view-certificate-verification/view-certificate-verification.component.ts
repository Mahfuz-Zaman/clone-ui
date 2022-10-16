import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpStatusCodeEnum} from '../../../../enum/http-status-code.enum';
import {CertificateVerification} from '../../../../interfaces/certificate-verification';
import {CertificateVerificationService} from '../../../../services/certificate-verification.service';

@Component({
  selector: 'app-view-certificate-verification',
  templateUrl: './view-certificate-verification.component.html',
  styleUrls: ['./view-certificate-verification.component.scss']
})
export class ViewCertificateVerificationComponent implements OnInit {

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  certificate: CertificateVerification;
  certificateValidity: any;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private certificateVerificationService: CertificateVerificationService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCertificateByCertificateId();
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
  private getCertificateByCertificateId() {
    this.spinner.show();
    this.certificateVerificationService.getCertificateByCertificateId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.certificate = res.data;
          this.certificateValidity = res.data.validity;
          // console.log('certificateValidity',this.certificateValidity);
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  isAfterToday(date) {
    console.log('isAfterToday [Admin]',new Date(date).valueOf() > new Date().valueOf());

    return new Date(date).valueOf() > new Date().valueOf();
  }
}
