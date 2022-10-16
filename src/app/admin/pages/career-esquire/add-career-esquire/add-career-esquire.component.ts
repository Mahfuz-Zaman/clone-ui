import {Component, OnInit, ViewChild} from '@angular/core';
import {CareerEsquire} from '../../../../interfaces/career-esquire';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BlogService} from '../../../../services/blog.service';
import {TextEditorCtrService} from '../../../../services/text-editor-ctr.service';
import {CareerEsquireService} from '../../../../services/career-esquire.service';
import {Blog} from '../../../../interfaces/blog';

@Component({
  selector: 'app-add-career-esquire',
  templateUrl: './add-career-esquire.component.html',
  styleUrls: ['./add-career-esquire.component.scss']
})
export class AddCareerEsquireComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  careerEsquire: CareerEsquire;

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

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
    private careerEsquireService: CareerEsquireService,
    public textEditorCtrService: TextEditorCtrService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      slug: [null, Validators.required],
      author: [null, Validators.required],
      shortDescription: [null, Validators.required],
      body: [null, Validators.required],
      priority: [null],
      image: [null],
    });

    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {
      if (this.storageService.getStoredInput('CAREER_ESQUIRE_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('CAREER_ESQUIRE_INPUT'));
      }

      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.dataForm.patchValue(
          {image: this.pickedImage}
        );
      }

    }

    this.autoGenerateSlug();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getBlogByBlogID();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.careerEsquire);

    if (this.storageService.getStoredInput('CAREER_ESQUIRE_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('CAREER_ESQUIRE_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.careerEsquire.image ? this.careerEsquire.image : this.placeholder;
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
    if (this.careerEsquire) {
      const finalData = {...this.dataForm.value, ...{_id: this.careerEsquire._id}};
      this.editCareerEsquireData(finalData);
    } else {
      this.addCareerEsquire(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'CAREER_ESQUIRE_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addCareerEsquire(data: CareerEsquire) {
    this.spinner.show();
    this.careerEsquireService.addCareerEsquire(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('CAREER_ESQUIRE_INPUT');
        this.pickedImage = this.placeholder;
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private getBlogByBlogID() {
    this.spinner.show();
    this.careerEsquireService.getCareerEsquireByID(this.id)
      .subscribe(res => {
        this.careerEsquire = res.data;
        if (this.careerEsquire) {
          this.setFormData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }


  private editCareerEsquireData(data: CareerEsquire) {
    this.spinner.show();
    this.careerEsquireService.editCareerEsquireData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('CAREER_ESQUIRE_INPUT');
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
      this.storageService.removeSessionData('CAREER_ESQUIRE_INPUT');
    }
  }


}
