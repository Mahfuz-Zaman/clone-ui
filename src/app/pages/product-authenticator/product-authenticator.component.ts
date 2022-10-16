import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductAuthenticator} from '../../interfaces/product-authenticator';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../services/ui.service';
import {ProductAuthenticatorService} from '../../services/product-authenticator.service';
import {UtilsService} from '../../services/utils.service';
import {StorageService} from '../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BridgeService} from '../../services/bridge.service';

@Component({
  selector: 'app-product-authenticator',
  templateUrl: './product-authenticator.component.html',
  styleUrls: ['./product-authenticator.component.scss']
})
export class ProductAuthenticatorComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;


  dataForm?: FormGroup;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  productAuthenticator: ProductAuthenticator;

  isAuthenticate = false;

  showMessageContainer = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private productAuthenticatorService: ProductAuthenticatorService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private spinner: NgxSpinnerService,
    private bridgeService: BridgeService
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      imei: [null, Validators.required],
      verifyCode: [null, Validators.required]
    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.bridgeService?.captchaTxt === this.dataForm.value.verifyCode.trim()) {
      const finalData = {
        imeiOrSn: this.dataForm.value.imei,
      };
      this.checkProductAuthenticate(finalData);
    } else {
      this.uiService.warn('Your given captcha input is invalid');
    }


  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private checkProductAuthenticate(data) {
    this.spinner.show();
    this.productAuthenticatorService.checkProductAuthenticate(data)
      .subscribe(res => {
        this.spinner.hide();
        this.showMessageContainer = true;
        this.isAuthenticate = res.success;
        this.templateForm.resetForm();
        this.bridgeService.resetCaptchaText();
      }, error => {
        this.spinner.hide();
        this.uiService.warn('This imei or sn not exists');
      });
  }

  onBack() {
    this.showMessageContainer = false;
    this.isAuthenticate = false;
  }

}
