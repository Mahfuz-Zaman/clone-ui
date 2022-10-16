import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {ProductAttribute} from '../../../../interfaces/product-attribute';
import {AttributeService} from '../../../../services/attribute.service';
import {ProductBrand} from '../../../../interfaces/product-brand';
import {BrandService} from '../../../../services/brand.service';
import {CategoryService} from '../../../../services/category.service';
import {ProductCategory} from '../../../../interfaces/product-category';
import {SubCategoryService} from '../../../../services/sub-category.service';
import {ProductSubCategory} from '../../../../interfaces/product-sub-category';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpStatusCodeEnum} from '../../../../enum/http-status-code.enum';

@Component({
  selector: 'app-add-new-sub-category',
  templateUrl: './add-new-sub-category.component.html',
  styleUrls: ['./add-new-sub-category.component.scss']
})
export class AddNewSubCategoryComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  subCategory: ProductSubCategory;
  attributes: ProductAttribute[] = [];
  brands: ProductBrand[] = [];
  categories: ProductCategory[] = [];

  // Destroy Session
  needSessionDestroy = true;


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private attributeService: AttributeService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      subCategoryName: [null, Validators.required],
      subCategorySlug: [null, Validators.required],
      tag: [null],
      category: [null, Validators.required],
      attributes: [null, Validators.required],
    });


    // IF HAVE DATA ON SESSION
    if (!this.id) {
      if (this.storageService.getStoredInput('SUB_CATEGORY_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('SUB_CATEGORY_INPUT'));
      }
    }

    this.autoGenerateSlug();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getSubCategoryBySubCategoryId();
      }
    });

    // GET ALL SELECTED DATA
    this.getAllAttributes();
    this.getAllCategory();

  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.subCategory) {
      const finalData = {...this.dataForm.value, ...{_id: this.subCategory._id}};
      this.editSubCategoryData(finalData);
    } else {
      this.addSubCategory(this.dataForm.value);
    }
  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('subCategoryName').valueChanges
        .pipe(
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            subCategorySlug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'SUB_CATEGORY_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private getAllAttributes() {
    this.attributeService.getAllAttributes()
      .subscribe(res => {
        this.attributes = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getAllCategory() {
    this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }


  private addSubCategory(data: ProductSubCategory) {
    this.spinner.show();
    this.subCategoryService.addSubCategory(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('SUB_CATEGORY_INPUT');
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        if (error.error.statusCode === HttpStatusCodeEnum.EXISTS_OR_NOT_ACCEPT) {
          this.dataForm.controls.subCategoryName.setErrors({incorrect: true});
        }
      });
  }

  private getAttributeByAttributeId() {
    this.attributeService.getAttributeByAttributeId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
        }
      }, error => {
        console.log(error);
      });
  }

  private getSubCategoryBySubCategoryId() {
    this.subCategoryService.getSubCategoryBySubCategoryId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          this.subCategory = res.data;
        }
      }, error => {
        console.log(error);
      });
  }

  private editSubCategoryData(data: ProductSubCategory) {
    this.subCategoryService.editSubCategoryData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('SUB_CATEGORY_INPUT');
      }, error => {
        console.log(error);
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('SUB_CATEGORY_INPUT');
    }
  }

}
