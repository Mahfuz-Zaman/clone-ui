import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {StoreInfo} from '../../../../interfaces/store-info';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {StoreInfoService} from '../../../../services/store-info.service';

declare const L: any;

@Component({
  selector: 'app-add-store-info',
  templateUrl: './add-store-info.component.html',
  styleUrls: ['./add-store-info.component.scss']
})
export class AddStoreInfoComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  isLoading: false;
  private sub: Subscription;

  // Store Data from param
  id?: string;
  store: StoreInfo;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private storeInfoService: StoreInfoService
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      storeName: [null, Validators.required],
      address: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      district: [null, Validators.required],
      country: [null, Validators.required],
      map: [null, Validators.required],
    });

    // IF HAVE DATA ON SESSION
    if (this.storageService.getStoredInput('STORE_INFO_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('STORE_INFO_INPUT'));
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getStoreInfoByStoreInfoId();
        // console.log('Iam in edit mood');
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.store) {
      const finalData = {...this.dataForm.value, ...{_id: this.store._id}};
      this.editStoreInfo(finalData);
    }
    else {
      this.addStoreInfo(this.dataForm.value);
    }

  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addStoreInfo(data: StoreInfo) {
    this.storeInfoService.addStoreInfo(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('STORE_INFO_INPUT');
      }, error => {
        console.log(error);
      });
  }

  private getStoreInfoByStoreInfoId() {
    this.storeInfoService.getStoreInfoByStoreInfoId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          // @ts-ignore
          this.store = res.data;
        }
      }, error => {
        console.log(error);
      });
  }

  private editStoreInfo(data: StoreInfo) {
    this.storeInfoService.editStoreInfo(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('STORE_INFO_INPUT');
      }, error => {
        console.log(error);
      });
  }
}
