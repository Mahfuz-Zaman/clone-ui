import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {UserDataService} from '../../../../services/user-data.service';
import {ReloadService} from '../../../../services/reload.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-customer-dialog',
  templateUrl: './customer-edit-dialog.component.html',
  styleUrls: ['./customer-edit-dialog.component.scss']
})
export class CustomerEditDialogComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  userStatus: any[] = [
    {value: false, viewValue: 'Block'},
    {value: true, viewValue: 'Unblock'},
  ];


  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private utilsService: UtilsService,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    public dialogRef: MatDialogRef<CustomerEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      hasAccess: [null, Validators.required],
    });

    if (this.data) {
      this.dataForm.patchValue({hasAccess: this.data.hasAccess});
    }
  }

  onSubmit() {
    const hasAccess = this.dataForm.value.hasAccess;

    this.editUserAccess(this.data._id, hasAccess);
  }

  private editUserAccess(userId: string, hasAccess: boolean) {
    this.userDataService.editUserAccess(userId, {hasAccess}).subscribe(res => {
      this.uiService.success(res.message);
      this.reloadService.needRefreshUser$();
      this.dialogRef.close();
    }, error => {
      console.log(error);
      this.uiService.warn('Something went wrong!');
    });
  }
}
