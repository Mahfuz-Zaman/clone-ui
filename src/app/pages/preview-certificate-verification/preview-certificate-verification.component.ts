import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../services/ui.service';
import {UtilsService} from '../../services/utils.service';
import {StorageService} from '../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpStatusCodeEnum} from '../../enum/http-status-code.enum';
import {CertificateVerification} from '../../interfaces/certificate-verification';
import {CertificateVerificationService} from '../../services/certificate-verification.service';

@Component({
  selector: 'app-preview-certificate-verification',
  templateUrl: './preview-certificate-verification.component.html',
  styleUrls: ['./preview-certificate-verification.component.scss']
})
export class PreviewCertificateVerificationComponent implements OnInit {

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  certificateNumber?: string;
  certificate: CertificateVerification;
  certificateValidity: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private certificateVerificationService: CertificateVerificationService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      console.log('Params [User]', param);

      this.certificateNumber = param.get('certificateNumber');
      this.getSingleCertificateBycertificateNumber();
    });
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */
   private getSingleCertificateBycertificateNumber() {
    this.certificateVerificationService.getSingleCertificateBycertificateNumber(this.certificateNumber)
      .subscribe(res => {
        if (res.data) {
          this.certificate = res.data;
          this.certificateValidity = res.data.validity;
          this.spinner.hide();
        }
      }, error => {
        console.log(error);
      });
  }
  isAfterToday(date) {
    console.log('Date [User]', date);

    console.log('isAfterToday [User]',new Date(date).valueOf() > new Date().valueOf());
    return new Date(date).valueOf() > new Date().valueOf();
  }
}
