import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {CategoryService} from '../../../../services/category.service';
import {ProductCategory} from '../../../../interfaces/product-category';
import {AttributeService} from '../../../../services/attribute.service';
import {ProductAttribute} from '../../../../interfaces/product-attribute';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpStatusCodeEnum} from '../../../../enum/http-status-code.enum';
import { Editor } from 'ngx-editor';
import {AngularEditorConfig} from "@kolkov/angular-editor";

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrls: ['./add-new-category.component.scss']
})
export class AddNewCategoryComponent implements OnInit, OnDestroy {
  editor: Editor;
  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  category: ProductCategory;

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

  editorConfigDesc: AngularEditorConfig = {
    editable: true,
    minHeight: '250px',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter/Copy product descriptions...',
    sanitize: false,
    toolbarPosition: 'top',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
  };

  attributes: ProductAttribute[] = [];


  // Destroy Session
  needSessionDestroy = true;


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private attributeService: AttributeService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.dataForm = this.fb.group({
      categoryName: [null, Validators.required],
      categorySlug: [null, Validators.required],
      attributes: [null, Validators.required],
      priority: [null, Validators.required],
      image: [null],
      description:[null],
    });

    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {
      if (this.storageService.getStoredInput('CATEGORY_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('CATEGORY_INPUT'));
      }
      // Image From state
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
        this.getCategoryByCategoryId();
      }
    });

    this.getAllAttributes();

  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.category);

    if (this.storageService.getStoredInput('CATEGORY_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('CATEGORY_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.category.image ? this.category.image : this.placeholder;
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.category) {
      const finalData = {...this.dataForm.value, ...{_id: this.category._id}};
      this.editCategoryData(finalData);
    } else {
      this.addCategory(this.dataForm.value);
    }
  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('categoryName').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            categorySlug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'CATEGORY_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */


  private getAllAttributes() {
    this.attributeService.getAllAttributes()
      .subscribe(res => {
        this.attributes = res.data;
        this.storageService.removeSessionData('CATEGORY_INPUT');
      }, error => {
        console.log(error);
      });
  }


  private addCategory(data: ProductCategory) {
    this.spinner.show();
    this.categoryService.addCategory(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('CATEGORY_INPUT');
        this.pickedImage = this.placeholder;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        if (error.error.statusCode === HttpStatusCodeEnum.EXISTS_OR_NOT_ACCEPT) {
          this.dataForm.controls.categoryName.setErrors({incorrect: true});
        }
      });
  }

  private getCategoryByCategoryId() {
    this.categoryService.getCategoryByCategoryId(this.id)
      .subscribe(res => {
        this.category = res.data;
        if (this.category) {
          this.setFormData();
        }
      }, error => {
        console.log(error);
      });
  }

  private editCategoryData(data: ProductCategory) {
    this.spinner.show();
    this.categoryService.editCategoryData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('CATEGORY_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('CATEGORY_INPUT');
    }
  }
}
