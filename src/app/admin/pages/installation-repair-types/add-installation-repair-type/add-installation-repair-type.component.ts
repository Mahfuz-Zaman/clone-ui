import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {InstallationRepairType} from '../../../../interfaces/installation-repair-type';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {TextEditorCtrService} from '../../../../services/text-editor-ctr.service';
import {InstallationRepairTypeService} from '../../../../services/installation-repair-type.service';
import {PromotionalOffer} from '../../../../interfaces/promotional-offer';

@Component({
  selector: 'app-add-installation-repair-type',
  templateUrl: './add-installation-repair-type.component.html',
  styleUrls: ['./add-installation-repair-type.component.scss']
})
export class AddInstallationRepairTypeComponent implements OnInit {
  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  installationRepairType: InstallationRepairType;

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
    private installationRepairTypeService: InstallationRepairTypeService,
    public textEditorCtrService: TextEditorCtrService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      slug: [null, Validators.required],
      shortDescription: [null],
      description: [null],
      image: [null],
    });

    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {
      if (this.storageService.getStoredInput('INSTALLATION_REPAIR_TYPE_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('INSTALLATION_REPAIR_TYPE_INPUT'));
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
        this.getSingleInstallationRepairTypeById();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.installationRepairType);

    if (this.storageService.getStoredInput('INSTALLATION_REPAIR_TYPE_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('INSTALLATION_REPAIR_TYPE_INPUT'));
    }

    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.installationRepairType.image ? this.installationRepairType.image : this.placeholder;
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
    if (this.installationRepairType) {
      const finalData = {...this.dataForm.value, ...{_id: this.installationRepairType._id}};
      this.editInstallationRepairTypeData(finalData);
    } else {
      // console.log(this.dataForm.value);
      this.addNewInstallationRepairType(this.dataForm.value);
    }
  }

  /**
   * ON HOLD INPUT DATA
   */
  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'INSTALLATION_REPAIR_TYPE_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewInstallationRepairType(data: InstallationRepairType) {
    this.spinner.show();
    this.installationRepairTypeService.addNewInstallationRepairType(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('INSTALLATION_REPAIR_TYPE_INPUT');
        this.pickedImage = this.placeholder;
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private getSingleInstallationRepairTypeById() {
    this.spinner.show();
    this.installationRepairTypeService.getSingleInstallationRepairTypeById(this.id)
      .subscribe(res => {
        this.installationRepairType = res.data;
        if (this.installationRepairType) {
          this.setFormData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private editInstallationRepairTypeData(data: PromotionalOffer) {
    this.spinner.show();
    this.installationRepairTypeService.editInstallationRepairTypeData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('INSTALLATION_REPAIR_TYPE_INPUT');
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
      this.storageService.removeSessionData('INSTALLATION_REPAIR_TYPE_INPUT');
    }
  }

}
