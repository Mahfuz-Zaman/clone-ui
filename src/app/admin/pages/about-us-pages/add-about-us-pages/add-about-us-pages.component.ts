import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AboutUs} from '../../../../interfaces/about-us';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {TextEditorCtrService} from '../../../../services/text-editor-ctr.service';
import {AboutUsService} from '../../../../services/about-us.service';

@Component({
  selector: 'app-add-about-us-pages',
  templateUrl: './add-about-us-pages.component.html',
  styleUrls: ['./add-about-us-pages.component.scss']
})
export class AddAboutUsPagesComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  aboutUs: AboutUs;

  // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private aboutUsService: AboutUsService,
    public textEditorCtrService: TextEditorCtrService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      slug: [null, Validators.required],
      description: [null],
    });

    this.autoGenerateSlug();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getAboutUsByAboutUsID();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.aboutUs);

    if (this.storageService.getStoredInput('ABOUT_US_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('ABOUT_US_INPUT'));
    }
  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('title').valueChanges
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

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.aboutUs) {
      const finalData = {...this.dataForm.value, ...{_id: this.aboutUs._id}};
      this.editAboutUsData(finalData);
    } else {
      // console.log(this.dataForm.value);
      this.addAboutUs(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */
  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'ABOUT_US_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addAboutUs(data: AboutUs) {
    this.spinner.show();
    this.aboutUsService.addAboutUs(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('ABOUT_US_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private getAboutUsByAboutUsID() {
    this.spinner.show();
    this.aboutUsService.getAboutUsByAboutUsID(this.id)
      .subscribe(res => {
        this.aboutUs = res.data;
        if (this.aboutUs) {
          this.setFormData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }


  private editAboutUsData(data: AboutUs) {
    this.spinner.show();
    this.aboutUsService.editAboutUsData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('ABOUT_US_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('PROMOTIONAL_OFFER_INPUT');
    }
  }

}
