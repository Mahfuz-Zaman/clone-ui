import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../../../services/utils.service';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductAttribute} from '../../../../interfaces/product-attribute';
import {ProductBrand} from '../../../../interfaces/product-brand';
import {ProductCategory} from '../../../../interfaces/product-category';
import {ProductSubCategory} from '../../../../interfaces/product-sub-category';
import {AttributeService} from '../../../../services/attribute.service';
import {BrandService} from '../../../../services/brand.service';
import {CategoryService} from '../../../../services/category.service';
import {SubCategoryService} from '../../../../services/sub-category.service';
import {MatSelectChange} from '@angular/material/select';
import {Select} from '../../../../interfaces/select';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {TagService} from '../../../../services/tag.service';
import {ProductTag} from '../../../../interfaces/product-tag';
import {Product} from '../../../../interfaces/product';
import {ImageGallery} from '../../../../interfaces/image-gallery';
import {TextEditorCtrService} from '../../../../services/text-editor-ctr.service';
import {MatDialog} from '@angular/material/dialog';
import {ImageGalleryDialogComponent} from '../../image-gallery-dialog/image-gallery-dialog.component';
import {MatOption} from '@angular/material/core';
import {Editor} from 'ngx-editor';
import {HttpStatusCodeEnum} from '../../../../enum/http-status-code.enum';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {

  private sub?: Subscription;
  private subRouteOne?: Subscription;
  private subDataOne?: Subscription;
  private subDataTwo?: Subscription;
  private subDataThree?: Subscription;
  private subDataFour?: Subscription;
  private subDataFive?: Subscription;

  dataForm?: FormGroup;
  filterDataArray?: FormArray;
  autoSlug = true;

  // FOR RESET
  @ViewChild('formTemplate') formTemplate: NgForm;

  // Image
  chooseImage?: string[] = [];


  discountType: Select[] = [
    {
      value: 1,
      viewValue: 'Percentage'
    },
    {
      value: 2,
      viewValue: 'Cash'
    },
  ];

  stockVisibilities: Select[] = [
    {
      value: true,
      viewValue: 'Show Stock'
    },
    {
      value: false,
      viewValue: 'Hide Stock'
    },
  ];

  emiStatus: Select[] = [
    {
      value: 3,
      viewValue: '3 Months'
    },
    {
      value: 6,
      viewValue: '6 Months'
    },
    {
      value: 12,
      viewValue: '12 Months'
    },
  ];

  productsVisibilities: Select[] = [
    {
      value: true,
      viewValue: 'Visible'
    },
    {
      value: false,
      viewValue: 'Hide'
    },
  ];


  // SELECT DATA
  brands: ProductBrand[] = [];
  categories: ProductCategory[] = [];
  subCategories: ProductSubCategory[] = [];
  attributes: ProductAttribute[] = [];
  tags: ProductTag[] = [];

  // Select Filter
  public filteredCatList: ProductCategory[];
  public filteredSubCatList: ProductSubCategory[];
  public filteredBrandList: ProductBrand[];
  public filteredAttributesList: ProductAttribute[];
  public filteredTagsList: ProductTag[];

  // Hierarchy Attributes;
  categoryAttributes: ProductAttribute[] = [];
  subCategoryAttributes: ProductAttribute[] = [];


  // Selected Attributes
  selectedAttributes: ProductAttribute[] = [];
  @ViewChild('attributeOpt') attributeOpt: MatOption;

  // Store Product
  id: string = null;
  product: Product = null;

  // NGX EDITOR
  editor: Editor;
  editorWarrantyService: Editor;
  editorWarrantyPolicy: Editor;
  editorPaymentPolicy: Editor;
  editorDeliveryPolicy: Editor;
  editorShortDescription: Editor;


  constructor(
    private fb: FormBuilder,
    private utilsService: UtilsService,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private attributeService: AttributeService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private productService: ProductService,
    private tagService: TagService,
    private spinner: NgxSpinnerService,
    private activatedRoute: ActivatedRoute,
    public textEditorCtrService: TextEditorCtrService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    // INIT FORM
    this.initFormGroup();

    // EDITOR
    this.editor = new Editor();
    this.editorWarrantyService = new Editor();
    this.editorWarrantyPolicy = new Editor();
    this.editorPaymentPolicy = new Editor();
    this.editorDeliveryPolicy = new Editor();
    this.editorShortDescription = new Editor();

    // GET ID FORM PARAM
    this.subRouteOne = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleProductById();
      } else {
        // GET ALL SELECTED DATA
        this.getAllAttributes();
        this.getAllCategory();
        // this.getAllSubCategory();
        this.getAllBrands();
        this.getAllTags();
      }
    });

    // Auto Generate Slug
    this.autoGenerateSlug();

  }


  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog() {
    const dialogRef = this.dialog.open(ImageGalleryDialogComponent, {
      panelClass: ['theme-dialog', 'full-screen-modal-lg'],
      width: '100%',
      minHeight: '100%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.data && dialogResult.data.length > 0) {
          this.getPickedImages(dialogResult.data);
        }
      }
    });
  }


  /**
   * GET IMAGE DATA FROM STATE
   */
  private getPickedImages(images: ImageGallery[]) {
    if (this.chooseImage && this.chooseImage.length > 0) {
      const nImages = images.map(m => m.url);
      this.chooseImage = this.utilsService.mergeArrayString(nImages, this.chooseImage);
    } else {
      this.chooseImage = images.map(m => m.url);
    }
    this.dataForm.patchValue(
      {images: this.chooseImage}
    );
  }


  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      productName: [null, Validators.required],
      productSlug: [null, Validators.required],
      images: [null],
      sku: [null],
      price: [null, Validators.required],
      discountType: [null],
      discountAmount: [null],
      stockVisibility: [null],
      productVisibility: [null],
      quantity: [null],
      // soldQuantity: [null],
      category: [null],
      categorySlug: [null],
      subCategory: [null],
      subCategorySlug: [null],
      brand: [null],
      brandSlug: [null],
      tags: [null],
      warrantyServices: [null],
      shortDescription: [null],
      description: [null],
      attributes: [null],
      // videoLink: [null],
      deliveryPolicy: [null],
      paymentPolicy: [null],
      warrantyPolicy: [null],
      campaignStartDate: [null],
      campaignStartTime: [null],
      campaignEndDate: [null],
      campaignEndTime: [null],
      emiStatus: [null],
      youtubeUrl: [null],
      filterData: this.fb.array([])
    });

    this.filterDataArray = this.dataForm.get('filterData') as FormArray;
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    this.spinner.show();
    let subCategorySlug;
    const rawData = this.dataForm.value;
    const categorySlug = this.categories.find(f => f._id === rawData.category).categorySlug;
    if (rawData.subCategory) {
      subCategorySlug = this.subCategories.find(f => f._id === rawData.subCategory).subCategorySlug;
    }
    const brandSlug = this.brands.find(f => f._id === rawData.brand).brandSlug;
    const images = this.chooseImage;
    const mData = {
      categorySlug,
      subCategorySlug: subCategorySlug ? subCategorySlug : null,
      brandSlug, images,
      campaignStartDate: rawData.campaignStartDate ? this.utilsService.getDateString(rawData.campaignStartDate) : null,
      campaignEndDate: rawData.campaignEndDate ? this.utilsService.getDateString(rawData.campaignEndDate) : null,
      attributes: this.dataForm.value.filterData.map(m => m._id)
    };
    const finalData = {
      ...rawData,
      ...mData
    };

    // console.log(finalData);

    if (this.id) {
      const mDataEdit = {...finalData, ...{_id: this.id}};
      this.editProductById(mDataEdit);
    } else {
      this.addSingleProduct(finalData);
    }

  }


  /**
   * AUTO CALCULATE AND FORM INPUT
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm?.get('productName').valueChanges
        .pipe(
        ).subscribe(d => {
          const slug = this.utilsService.transformToSlug(d ? d : '');
          this.dataForm?.patchValue({
            productSlug: slug
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
   * ON HOLD DATA
   */

  onHoldInputData() {
    this.storageService.storeInputData(this.dataForm?.value, 'PRODUCT_INPUT');
  }

  /**
   * REMOVE SELECTED IMAGE
   */
  removeSelectImage(s: string) {
    const index = this.chooseImage.findIndex(x => x === s);
    this.chooseImage.splice(index, 1);
  }

  /**
   * PATCH FORM ARRAY
   */
  private patchFormValueWithArray() {
    // const filterData = this.product?.filterData as FilterData[];
    console.log('this.product.filterData',this.product.filterData);

    if (this.product && this.product.filterData && this.product.filterData.length) {
      this.selectedAttributes = this.product.filterData.map(m => {
        return {
          _id: m._id,
          attributeName: m.attributeName,
          attributeSlug: this.utilsService.transformToSlug(m.attributeName),
          attributeValues: this.attributes.find(f => f._id === m._id).attributeValues
        } as ProductAttribute;
      });
      this.product.filterData.map((m, i) => {
        const f = this.fb.group({
          _id: [m._id],
          attributeName: [m.attributeName],
          attributeValues: [m.attributeValues],
        });
        (this.dataForm?.get('filterData') as FormArray).push(f);
      });
    }

  }

  private patchFormData() {
    this.chooseImage = this.product.images;
    this.dataForm.patchValue(this.product);
  }

  /**
   * SELECTION CHANGE
   */

  onSelectCategory(event: MatSelectChange) {
    this.categoryAttributes = this.categories.find(f => f._id === event.value).attributes as ProductAttribute[];
    this.dataForm.patchValue({subCategory: null});
    // this.removeAttributesFormArray();
    this.getAllSubCategoryByCategoryId(event.value, true);
  }

  onSelectSubCategory(event: MatSelectChange) {
    // this.dataForm.patchValue({filterData: null, attributes: null});
    // this.removeAttributesFormArray();
    this.subCategoryAttributes = this.subCategories.find(f => f._id === event.value).attributes as ProductAttribute[];
    // this.hierarchyAttributes();
  }

  onSelectAttribute(event: MatSelectChange) {
    const index = this.selectedAttributes.findIndex(x => x._id === event.source.value);
    if (event.value) {
      if (index === -1) {
        const attributeObj = this.attributes.find(data => data._id === event.source.value);
        this.selectedAttributes.push(attributeObj);
        const f = this.fb.group({
          _id: [attributeObj._id],
          attributeName: [attributeObj.attributeName],
          attributeValues: [null, Validators.required],
        });
        (this.dataForm?.get('filterData') as FormArray).push(f);
      }
    }

  }

  /**
   * REMOVE FORM BUILDER OBJECT
   */
  removeAttributesField(index: number) {
    this.filterDataArray?.removeAt(index);
    this.selectedAttributes.splice(index, 1);
  }

  private removeAttributesFormArray() {
    this.filterDataArray.controls.forEach((f, i) => {
      this.filterDataArray?.removeAt(i);
    });
    this.filterDataArray.controls.splice(0, this.filterDataArray.controls.length);
    this.selectedAttributes = [];
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private getAllAttributes() {
    this.subDataTwo = this.attributeService.getAllAttributes()
      .subscribe(res => {
        this.attributes = res.data;
        this.filteredAttributesList = this.attributes.slice();
        if (this.product) {
          this.patchFormValueWithArray();
        }
      }, error => {
        console.log(error);
      });
  } // MOST COMPLEX FORM ARRAY

  private getAllCategory() {
    this.subDataThree = this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
        this.filteredCatList = this.categories.slice();
        if (this.product) {
          const category = this.product.category as ProductCategory;
          // this.categories.forEach(f => {
          //   this.categoryAttributes = f.attributes as ProductAttribute[];
          // });
          // console.log(this.categoryAttributes);
          this.dataForm.patchValue({category: this.categories.find(f => f._id === category._id)._id});
          this.getAllSubCategoryByCategoryId(category._id, false);
        }
      }, error => {
        console.log(error);
      });
  }

  private getAllSubCategory() {
    this.subCategoryService.getAllSubCategory()
      .subscribe(res => {
        this.subCategories = res.data;
        this.filteredSubCatList = this.subCategories.slice();
        if (this.product) {
          const subCategory = this.product.subCategory as ProductSubCategory;
          if (subCategory) {
            this.dataForm.patchValue({subCategory: this.subCategories.find(f => f._id === subCategory._id)._id});
          }
        }
      }, error => {
        console.log(error);
      });
  }

  private getAllSubCategoryByCategoryId(categoryId: string, selectionChange: boolean) {
    this.subCategoryService.getSubCategoryByCategoryId(categoryId)
      .subscribe(res => {
        this.subCategories = res.data;
        this.filteredSubCatList = this.subCategories.slice();
        // if (this.product) {
        //   this.subCategories.forEach(f => {
        //     this.subCategoryAttributes = f.attributes as ProductAttribute[];
        //   });
        //   console.log(this.subCategoryAttributes);
        //   this.hierarchyAttributes();
        // }
        if (this.product && !selectionChange) {
          const subCategory = this.product.subCategory as ProductSubCategory;
          this.dataForm.patchValue({subCategory: this.subCategories.find(f => f._id === subCategory._id)._id});
        }
      }, error => {
        console.log(error);
      });
  }


  private getAllBrands() {
    this.subDataFour = this.brandService.getAllBrands()
      .subscribe(res => {
        this.brands = res.data;
        this.filteredBrandList = this.brands.slice();
        if (this.product) {
          const brand = this.product.brand as ProductBrand;
          this.dataForm.patchValue({brand: this.brands.find(f => f._id === brand._id)._id});
        }
      }, error => {
        console.log(error);
      });
  }

  private getAllTags() {
    // const pagination: Pagination = {
    //   currentPage: String(1),
    //   pageSize: String(50)
    // };
    this.subDataFive = this.tagService.getAllTags()
      .subscribe(res => {
        this.tags = res.data;
        this.filteredTagsList = this.tags.slice();
      }, error => {
        console.log(error);
      });
  }

  private addSingleProduct(data: any) {
    this.productService.addSingleProduct(data)
      .subscribe(res => {
        this.spinner.hide();
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PRODUCT_INPUT');
        this.resetForm();
        // this.resetForm();
      }, error => {
        this.spinner.hide();
        if (error.error.statusCode === HttpStatusCodeEnum.EXISTS_OR_NOT_ACCEPT) {
          this.dataForm.controls.productSlug.setErrors({incorrect: true});
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }
        console.log(error);
      });
  }

  private editProductById(data: any) {
    this.productService.editProductById(data)
      .subscribe(res => {
        this.spinner.hide();
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PRODUCT_INPUT');
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSingleProductById() {
    this.subDataOne = this.productService.getSingleProductById(this.id)
      .subscribe(res => {
        this.product = res.data;
        // this.filteredAttributesList = this.product.attributes.slice();
        // console.log('filteredAttributesList: ', this.filteredAttributesList);
        // this.patchFormValueWithArray();
        if (this.product) {
          this.patchFormData();
          // // GET ALL SELECTED DATA
          this.getAllAttributes();
          this.getAllCategory();
          this.getAllBrands();
          this.getAllTags();
        }
      }, error => {
        console.log(error);
      });
  }

  private hierarchyAttributes() {
    this.attributes = this.utilsService.margeMultipleArrayUnique('_id', this.categoryAttributes, this.subCategoryAttributes);
    this.filteredAttributesList = this.attributes.slice();
    // console.log(this.attributes);
    if (this.product) {
      if (this.product.attributes && this.product.attributes.length > 0) {
        const attributesId = this.product.attributes.map(m => m._id);
        this.dataForm.patchValue({attributes: attributesId});
        this.patchFormValueWithArray();
      }
    }

  }

  /**
   * RESET FORM STATE
   */

  private resetForm() {
    this.formTemplate.resetForm();
    this.filterDataArray = null;
    this.chooseImage = [];
    this.selectedAttributes = [];
    this.initFormGroup();
    this.autoGenerateSlug();
  }

  /**
   * DUG & DROP IMAGE REARRANGE
   */

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.chooseImage, event.previousIndex, event.currentIndex);
  }


  ngOnDestroy() {
    this.storageService.removeSessionData('PRODUCT_INPUT');
    this.editor.destroy();
    this.editorWarrantyService.destroy();
    this.editorWarrantyPolicy.destroy();
    this.editorPaymentPolicy.destroy();
    this.editorDeliveryPolicy.destroy();
    this.editorShortDescription.destroy();

    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subRouteOne) {
      this.subRouteOne.unsubscribe();
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe();
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe();
    }

    if (this.subDataFour) {
      this.subDataFour.unsubscribe();
    }
    if (this.subDataFive) {
      this.subDataFive.unsubscribe();
    }

  }

}
