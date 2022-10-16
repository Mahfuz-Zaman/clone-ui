import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Select} from '../../../../interfaces/select';
import {Admin} from '../../../../interfaces/admin';
import {AdminDataService} from '../../../../services/admin-data.service';
import {UiService} from '../../../../services/ui.service';
import {AdminService} from '../../../../services/admin.service';
import {ADMIN_ROLES} from '../../../../core/utils/app-data';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  dataForm?: FormGroup;

  // Store Data
  user?: Admin;

  // Store Data From Param
  id?: string;

  roles: Select[] = ADMIN_ROLES;

  hasAccess: Select[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'},
  ];


  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private adminDataService: AdminDataService,
    private adminService: AdminService,
    private uiService: UiService,
  ) {
  }

  ngOnInit(): void {

    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.email],
      username: [null, Validators.required],
      phoneNo: [null, Validators.required],
      role: [null, Validators.required],
      hasAccess: [null, Validators.required],
      password: [null],
      newPassword: [null]
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleAdminById();
      }
    });
  }


  /**
   * SET FORM DATA
   */

  private setFormValue() {
    this.dataForm.patchValue({...this.user, ...{password: null}});
  }


  private getSingleAdminById() {
    this.adminDataService.getSingleAdminById(this.id)
      .subscribe(res => {
        this.user = res.data;
        this.setFormValue();
      }, error => {
        console.log(error);
      });
  }

  /**
   * ON SUBMIT FORM
   */
  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please filed all the required field');
      return;
    }


    if (this.user) {
      this.adminDataService.editAdmin(this.user._id, this.dataForm.value)
        .subscribe(res => {
          this.uiService.success(res.message);
        }, error => {
          this.uiService.wrong('Something went wrong!');
          console.log(error);
        });
    } else {
      if (!this.dataForm.value.password) {
        this.uiService.warn('Password need');
        return;
      }

      const finalData = {...this.dataForm?.value, ...{username: this.generateUsername}};

      // console.log(finalData);

      this.adminService.adminRegistration(this.dataForm.value)
        .subscribe(res => {
          if (res.success) {
            this.uiService.success(res.message);
            this.dataForm.reset();
          } else {
            this.uiService.warn(res.message);
          }
        }, error => {
          this.uiService.wrong('Something went wrong!');
          console.log(error);
        });
    }

  }


  /**
   * GENERATE USER NAME
   */
  public get generateUsername(): string {
    if (this.dataForm && this.dataForm.value.username) {
      // const rs = this.dataForm.value.username.replace(/[^a-zA-Z ]/g, '');
      const rw = this.dataForm.value.username.replace(/\s/g, '');
      return rw.trim().toLowerCase();
    } else {
      return '';
    }
  }


}
