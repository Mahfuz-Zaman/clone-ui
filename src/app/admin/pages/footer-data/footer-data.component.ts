import { Component, OnInit } from '@angular/core';
import {TextEditorCtrService} from '../../../services/text-editor-ctr.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ShopInfo} from '../../../interfaces/shop-info';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../services/ui.service';
import {TagService} from '../../../services/tag.service';
import {ShopService} from '../../../services/shop.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {StorageService} from '../../../services/storage.service';
import {FooterDataService} from '../../../services/footer-data.service';
import {FooterData} from '../../../interfaces/footer-data';

@Component({
  selector: 'app-footer-data',
  templateUrl: './footer-data.component.html',
  styleUrls: ['./footer-data.component.scss']
})
export class FooterDataComponent implements OnInit {

  dataForm?: FormGroup;

  socialLinksArray?: FormArray;

  footerData: FooterData;
  isLoading = false;

  // // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private tagService: TagService,
    public router: Router,
    private footerDataService: FooterDataService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    public textEditorCtrService: TextEditorCtrService,
  ) { }

  ngOnInit(): void {

    // INIT FORM
    this.initFormGroup();

    // GET DATA
    this.getFooterData();
  }

  /**
   * INIT FORM
   */
  private initFormGroup() {

    this.dataForm = this.fb.group({
      shortDes: [null],
      address: [null],
      phone: [null],
      email: [null],
      aboutEsquire: [null],
      title1: [null],
      title1Des: [null],
      title2: [null],
      title2Des: [null],
      title3: [null],
      title3Des: [null],
      title4: [null],
      title4Des: [null],
      title5: [null],
      title5Des: [null],
      socialLinks: this.fb.array([]),
    });
    this.socialLinksArray = this.dataForm.get('socialLinks') as FormArray;
  }

  // /**
  //  * SET FORM DATA
  //  */
  private setFormData() {
    this.dataForm.patchValue(this.footerData);

    if (this.storageService.getStoredInput('FOOTER_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('FOOTER_INPUT'));
    }

  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'FOOTER_INPUT');

  }

  /**
   * FORM ARRAY BUILDER
   */
  onAddNewShopObject(formControl: string) {
    const f = this.fb.group({
      type: [null],
      value: [null, Validators.required]
    });
    (this.dataForm?.get(formControl) as FormArray).push(f);
  }


  /**
   * REMOVE FORM BUILDER OBJECT
   */
  removeFormArrayField(formControl: string, index: number) {
    let formDataArray: FormArray;
    switch (formControl) {
      case 'socialLinks': {
        formDataArray = this.socialLinksArray;
        break;
      }
      default: {
        formDataArray = null;
        break;
      }
    }
    formDataArray?.removeAt(index);
  }

  /**
   * SET DATA
   */
  private setData() {
    this.footerData.socialLinks.map(m => {
      const f = this.fb.group({
        type: [m.type],
        value: [m.value, Validators.required],
      });
      (this.dataForm?.get('socialLinks') as FormArray).push(f);
    });

    this.dataForm.patchValue(this.footerData);
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.footerData) {
      const finalData = {...this.dataForm.value, ...{_id: this.footerData._id}};
      this.updateFooterData(finalData);
    } else {
      this.addFooterData(this.dataForm.value);
    }

  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addFooterData(data: any) {
    this.spinner.show();
    this.footerDataService.addFooterData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

  private getFooterData() {
    this.spinner.show();
    this.footerDataService.getFooterData()
      .subscribe(res => {
        this.footerData = res.data;
        if (this.footerData) {
          this.setData();
        }
        this.spinner.hide();

      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }


  private updateFooterData(data: FooterData) {
    this.spinner.show();
    this.footerDataService.updateFooterData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

}
