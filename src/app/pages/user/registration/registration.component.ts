import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {UiService} from '../../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {BulkSmsService} from 'src/app/services/bulk-sms.service';
import {BulkSms} from '../../../interfaces/bulk-sms';
import {PhoneVerificationDialogComponent} from '../../../shared/lazy-component/phone-verification-dialog/phone-verification-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {User} from '../../../interfaces/user';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  public dataForm: FormGroup;

  isHiddenPass = true;
  isHiddenConPass = true;

  // OTP
  generatedOtpCode: string;

  // Registration User Data
  registrationData: User;

  constructor(
    public userService: UserService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    public utilsService: UtilsService,
    private bulkSmsService: BulkSmsService,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.dataForm = this.fb.group({
      phoneNo: [null, Validators.required],
      email: [null, [Validators.email]],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],
      birthDate: [null, Validators.required],
      birthMonth: [null, Validators.required],
      birthYear: [null, Validators.required],
      fullName: [null, Validators.required],
      gender: [null, Validators.required],
      agree: [true, Validators.required],
    });
  }


  onSubmitForm() {
    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      this.uiService.warn('Please complete all the required field');
      return;
    }

    if (this.dataForm.value.password !== this.dataForm.value.confirmPassword) {
      this.uiService.warn('Password and confirm password not matched');
      return;
    }

    if (!this.utilsService.checkValidPhone(this.dataForm.value.phoneNo) || this.dataForm.value.phoneNo.length !== 11) {
      this.dataForm.get('phoneNo').setErrors({invalid: true});
      this.uiService.warn('Please enter a valid 11 digit phone no');
      return;
    }

    if (this.dataForm.value.password.length < 6) {
      this.uiService.warn('Password must be at lest 6 characters!');
      return;
    }

    this.spinner.show();

    const year = +this.dataForm.value.birthYear;
    const date = +this.dataForm.value.birthDate;
    const month = +this.dataForm.value.birthMonth;
    const buildDate = new Date(year, month, date);

    this.registrationData = {
      fullName: this.dataForm.value.fullName,
      phoneNo: this.dataForm.value.phoneNo,
      email: this.dataForm.value.email,
      password: this.dataForm.value.password,
      birthdate: this.utilsService.getDateWithCurrentTime(buildDate),
      gender: this.dataForm.value.gender,
      isPhoneVerified: true,
      registrationType: 'phone',
      isEmailVerified: false,
      hasAccess: true,
      username: this.dataForm.value.phoneNo,
    };

    this.checkAndGetUserByPhone(this.dataForm.value.phoneNo);

  }


  /**
   * HTTP REQ HANDLE
   */

  /**
   * BULK SMS
   */
  private sendSmsBySslAPi(phoneNo: string, message: string, uid: string) {
    const messageBody: BulkSms = {
      sms: message,
      csmsid: uid,
      msisdn: phoneNo
    };
    this.bulkSmsService.sendSmsBySslAPi(messageBody)
      .subscribe(res => {
        this.spinner.hide();
        if (res.success) {
          this.openComponentDialog();
        } else {
          this.spinner.hide();
          this.uiService.wrong('Something went wrong! Please try again.');
        }
      }, error => {
        this.uiService.wrong('Something went wrong! Please try again.');
        console.log(error);
        this.spinner.hide();
      });
  }

  private checkAndGetUserByPhone(phoneNo: string) {
    this.userService.checkAndGetUserByPhone(phoneNo)
      .subscribe(res => {
        const status = res.data;
        if (!status) {
          // Create Message Data
          const finalPhoneNo = '88' + this.dataForm.value.phoneNo;
          this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
          console.log('OTP COde', this.generatedOtpCode);
          const message = this.generatedOtpCode + ' is your OTP (One-Time Password) for Esquire Electronics. OTP will expire in 5 minutes.';
          // Sent Message
          this.sendSmsBySslAPi(finalPhoneNo, message, finalPhoneNo);
        } else {
          this.spinner.hide();
          this.uiService.warn('This phone no is already registered');
          this.dataForm.get('phoneNo').setErrors({invalid: true});
          this.dataForm.get('phoneNo').markAsTouched({onlySelf: true});
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  /**
   *  COMPONENT DIALOG
   */
  public openComponentDialog() {
    const mData = {
      otpCode: this.generatedOtpCode,
      phoneNo: this.dataForm.value.phoneNo,
      registrationData: this.registrationData
    };
    const dialogRef = this.dialog.open(PhoneVerificationDialogComponent, {
      data: mData,
      panelClass: ['theme-dialog', 'dialog-no-radius', 'small-padding-sm'],
      width: '95%',
      maxWidth: '400px',
      autoFocus: false,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult.regProgress) {
        this.spinner.show();
      }
    });
  }

  /**
   * PHONE VERIFICATION
   */


  /**
   * Form Validations
   */
  getFormField(fieldName: string) {
    return this.dataForm.get(fieldName);
  }

  get phoneNo() {
    return this.dataForm.get('phoneNo');
  }

  get email() {
    return this.dataForm.get('email');
  }

  get fullName() {
    return this.dataForm.get('fullName');
  }

  get password() {
    return this.dataForm.get('password');
  }

  get confirmPassword() {
    return this.dataForm.get('confirmPassword');
  }

  get gender() {
    return this.dataForm.get('gender');
  }

  get agree() {
    return this.dataForm.get('agree');
  }

  get birthDate() {
    return this.dataForm.get('birthDate');
  }

  get birthYear() {
    return this.dataForm.get('birthYear');
  }

  get birthMonth() {
    return this.dataForm.get('birthMonth');
  }

  get otpCode() {
    return this.dataForm.get('otpCode');
  }

  ngOnDestroy() {

  }


}
