import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Select} from '../../../../interfaces/select';
import {AdminDataService} from '../../../../services/admin-data.service';
import {UiService} from '../../../../services/ui.service';
import {AdminService} from '../../../../services/admin.service';
import {MatOptionSelectionChange} from '@angular/material/core';
import {Page} from '../../../../interfaces/page';
import {MODIFIED_ACCESS, PAGES} from '../../../../core/utils/page-list';
import {AdminRole} from '../../../../interfaces/admin-role';
import {UtilsService} from '../../../../services/utils.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  dataForm?: FormGroup;
  pagesArray?: FormArray;

  // Store Data
  role?: AdminRole;
  pages: Page[] = [];
  modifyAccess: Select[] = [];

  // Store Data From Param
  id?: string;

  // Selected
  selectedPages: any[] = [];


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adminDataService: AdminDataService,
    private adminService: AdminService,
    private uiService: UiService,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit(): void {
    // Init Form Builder
    this.initFormBuilder();

    // Init Pages & Modified Access
    this.pages = PAGES;
    this.modifyAccess = MODIFIED_ACCESS;

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleRoleById();
      }
    });
  }

  /**
   * INIT FROM BUILDER
   */
  private initFormBuilder() {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null],
      priority: [null, Validators.required],
      access: this.fb.array([])
    });

    this.pagesArray = this.dataForm.get('access') as FormArray;

  }

  /**
   * SET FORM DATA
   */

  private setFormValue() {
    const access = this.role.access;
    this.selectedPages = this.pages.filter(o1 => access.some(o2 => {
      return o1.routerLink === o2.page;
    }));

    this.selectedPages.map(() => {
      const f = this.fb.group({
        page: [null],
        modify: [null]
      });
      (this.dataForm?.get('access') as FormArray).push(f);
    });

    this.dataForm.patchValue(this.role);
  }


  /**
   * HTTP REQ HANDLE
   */
  private addAdminRole(data: AdminRole) {
    this.spinner.show();
    this.adminDataService.addAdminRole(data)
      .subscribe(res => {
        this.spinner.hide();
        this.uiService.success(res.message);
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSingleRoleById() {
    this.spinner.show();
    this.adminDataService.getSingleRoleById(this.id)
      .subscribe(res => {
        this.role = res.data;
        this.spinner.hide();
        this.setFormValue();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private editAdminRole(data: AdminRole) {
    this.spinner.show();
    this.adminDataService.editAdminRole(data)
      .subscribe(res => {
        this.uiService.success(res.message);
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  /**
   * ON SELECT CHANGE
   */
  onSelectPage(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const index = this.selectedPages.findIndex(x => x._id === event.source.value._id);
      if (index === -1) {
        this.selectedPages.push(event.source.value);
        const f = this.fb.group({
          page: event.source.value.routerLink,
          pageId: event.source.value.pageId,
          modify: [null, Validators.required]
        });
        (this.dataForm?.get('access') as FormArray).push(f);
      }
    }

  }

  /**
   * REMOVE FORM BUILDER OBJECT
   */
  removePagesField(index: number) {
    this.pagesArray?.removeAt(index);
    this.selectedPages.splice(index, 1);
  }


  /**
   * ON SUBMIT FORM
   */
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }

    const slug = this.utilsService.slugWithoutSymbol(this.dataForm?.value.name);
    const finalData = {...this.dataForm.value, ...{slug}};

    if (this.role) {
      const finalDataWithId = {...finalData, ...{_id: this.role._id}};
      this.editAdminRole(finalDataWithId);
    } else {
      this.addAdminRole(finalData);
    }

  }


}
