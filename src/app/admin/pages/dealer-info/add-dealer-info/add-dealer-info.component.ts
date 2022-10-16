import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DealerInfo} from '../../../../interfaces/dealer-info';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {StoreInfoService} from '../../../../services/store-info.service';
import {DealerInfoService} from '../../../../services/dealer-info.service';
import {StoreInfo} from '../../../../interfaces/store-info';

@Component({
  selector: 'app-add-dealer-info',
  templateUrl: './add-dealer-info.component.html',
  styleUrls: ['./add-dealer-info.component.scss']
})
export class AddDealerInfoComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  isLoading: false;
  private sub: Subscription;

  // Dealer Data from param
  id?: string;
  dealer: DealerInfo;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private dealerInfoService: DealerInfoService
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      dealerName: [null, Validators.required],
      address: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      district: [null, Validators.required],
      country: [null, Validators.required],
      map: [null, Validators.required],
    });

    // IF HAVE DATA ON SESSION
    if (this.storageService.getStoredInput('DEALER_INFO_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('DEALER_INFO_INPUT'));
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getDealerInfoByDealerInfoId();
        // console.log('Iam in edit mood');
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.dealer) {
      const finalData = {...this.dataForm.value, ...{_id: this.dealer._id}};
      this.editDealerInfo(finalData);
    }
    else {
      this.addDealerInfo(this.dataForm.value);
    }
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addDealerInfo(data: DealerInfo) {
    this.dealerInfoService.addDealerInfo(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('DEALER_INFO_INPUT');
      }, error => {
        console.log(error);
      });
  }

  private getDealerInfoByDealerInfoId() {
    this.dealerInfoService.getDealerInfoByDealerInfoId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          // @ts-ignore
          this.dealer = res.data;
        }
      }, error => {
        console.log(error);
      });
  }

  private editDealerInfo(data: DealerInfo) {
    this.dealerInfoService.editDealerInfo(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('DEALER_INFO_INPUT');
      }, error => {
        console.log(error);
      });
  }
}
