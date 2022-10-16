import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {AttributeService} from '../../../../services/attribute.service';
import {ProductAttribute} from '../../../../interfaces/product-attribute';
import {StorageService} from '../../../../services/storage.service';
import {UtilsService} from '../../../../services/utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {HttpStatusCodeEnum} from '../../../../enum/http-status-code.enum';

@Component({
  selector: 'app-add-new-attribute',
  templateUrl: './add-new-attribute.component.html',
  styleUrls: ['./add-new-attribute.component.scss']
})
export class AddNewAttributeComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  attributeDataArray?: FormArray;

  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  attribute: ProductAttribute;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private attributeService: AttributeService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.initFormGroup();

    this.autoGenerateSlug();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getAttributeByAttributeId();
      }
    });
  }

  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      attributeName: [null, Validators.required],
      attributeSlug: [null, Validators.required],
      attributeValues: new FormArray([new FormControl(null)])
    });
    this.attributeDataArray = this.dataForm.get('attributeValues') as FormArray;
  }

  /**
   * FORM ARRAY BUILDER
   */

  onAddNewFormControl() {
    const form = new FormControl('');
    (this.dataForm.controls['attributeValues'] as FormArray).push(form);
  }

  /**
   * REMOVE FORM BUILDER OBJECT
   */
  removeFormArrayField(index: number) {
    (this.dataForm.get('attributeValues') as FormArray).removeAt(index);
  }


  /**
   * SET DATA
   */
  private setData() {
    this.removeFormArrayField(0);
    this.attribute.attributeValues.map(m => {
      const form = new FormControl(m);
      (this.dataForm.controls['attributeValues'] as FormArray).push(form);
    });

    this.dataForm.patchValue(this.attribute);
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.attribute) {
      const finalData = {...this.dataForm.value, ...{_id: this.attribute._id}};
      this.editAttributeData(finalData);
    } else {
      this.addAttribute(this.dataForm.value);
    }
  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('attributeName').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d?.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            attributeSlug: res
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
    this.storageService.storeInputData(this.dataForm?.value, 'ATTRIBUTE_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addAttribute(data: ProductAttribute) {
    this.spinner.show();
    this.attributeService.addAttribute(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.templateForm.resetForm();
        this.storageService.removeSessionData('ATTRIBUTE_INPUT');
      }, error => {
        this.spinner.hide();
        if (error.error.statusCode === HttpStatusCodeEnum.EXISTS_OR_NOT_ACCEPT) {
          this.dataForm.controls.attributeName.setErrors({incorrect: true});
        }
      });
  }

  private getAttributeByAttributeId() {
    this.spinner.show();
    this.attributeService.getAttributeByAttributeId(this.id)
      .subscribe(res => {
        this.attribute = res.data;
        if (this.attribute) {
          this.setData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private editAttributeData(data: ProductAttribute) {
    this.spinner.show();
    this.attributeService.editAttributeData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('ATTRIBUTE_INPUT');
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
  }

}
