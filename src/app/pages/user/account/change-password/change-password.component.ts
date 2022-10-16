import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from '../../../../services/user.service';
import {UiService} from '../../../../services/ui.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  // For Reset
  @ViewChild('formDirective') formDirective: NgForm;

  public formData: FormGroup;


  constructor(
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private fb: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.formData = this.fb.group({
      oldPassword: [null, Validators.required],
      newPassword: [null, Validators.required]
    });
  }


  onSubmitForm() {
    if (this.formData.invalid) {
      return;
    }

    if (this.formData.value.newPassword.length < 6) {
      this.uiService.warn('Password must be at lest 6 characters!');
      return;
    }
    this.updatePassword();

  }


  private updatePassword() {
    this.userService.updatePassword(this.formData.value)
      .subscribe(res => {
        if (res.success) {
          this.uiService.success(res.message);
          this.formDirective.resetForm();
          // this.router.navigate(['/dashboard']);
        } else {
          this.uiService.wrong(res.message);
        }
      }, error => {
        console.log(error);
      });
  }


}
