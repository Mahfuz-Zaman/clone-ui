import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UiService} from '../../../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AdminDataService} from '../../../../services/admin-data.service';

@Component({
  selector: 'app-add-new-tag',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss']
})
export class AdminChangePasswordComponent implements OnInit, OnDestroy {

  dataForm?: FormGroup;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private adminDataService: AdminDataService,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<AdminChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required]
    });

    // GET DATA FROM DIALOG
    if (this.data) {
      // console.log(this.data);
    }
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    this.changeAdminOwnPassword();

  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private changeAdminOwnPassword() {
    this.spinner.show();
    this.adminDataService.changeAdminOwnPassword(this.dataForm?.value)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.dialogRef.close();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  ngOnDestroy() {

  }


}
