import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UiService} from '../../../services/ui.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BulkSms} from '../../../interfaces/bulk-sms';
import {BulkSmsService} from '../../../services/bulk-sms.service';
import {UtilsService} from '../../../services/utils.service';
import {UserService} from '../../../services/user.service';
import {User} from '../../../interfaces/user';
import {StorageService} from '../../../services/storage.service';
import {DATABASE_KEY} from '../../../core/utils/global-variable';

@Component({
  selector: 'app-phone-verification-dialog',
  templateUrl: './phone-verification-dialog.component.html',
  styleUrls: ['./phone-verification-dialog.component.scss']
})
export class PhoneVerificationDialogComponent implements OnInit, OnDestroy {

  verificationForm: FormGroup;
  submitted = false;
  phoneNo: string;

  // Counter
  countDown = 0;
  timeInstance = null;

  // OTP
  generatedOtpCode: string;
  expireCountDown = 0;
  timeInstanceExpire = null;
  otpMatched = false;

  registrationData: User;

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private userService: UserService,
    private bulkSmsService: BulkSmsService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<PhoneVerificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    if (this.data) {
      this.phoneNo = this.data.phoneNo;
      this.generatedOtpCode = this.data.otpCode;
      this.registrationData = this.data.registrationData;
      this.countOtpExpireTime(300);
      this.countResendTime(60);
    }

    this.verificationForm = this.fb.group({
      code1: ['', Validators.required],
      code2: ['', Validators.required],
      code3: ['', Validators.required],
      code4: ['', Validators.required],
      code5: ['', Validators.required],
      code6: ['', Validators.required],
    });
  }

  nextStep(event, step: number): void {
    if (this.verificationForm.valid) {
      this.onSubmit();
    }
    const prevElement = document.getElementById('code' + (step - 1));
    const nextElement = document.getElementById('code' + (step + 1));
    if (event.code === 'Backspace' && event.target.value === '') {
      // event.target.parentElement.parentElement.children[step - 2 > 0 ? step - 2 : 0].children[0].value = ''
      if (prevElement) {
        prevElement.focus();
        return;
      }
    } else {
      if (nextElement) {
        nextElement.focus();
        return;
      } else {

      }
    }


  }

  paste(event) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData.getData('text');
    this.verificationForm.setValue({
      code1: pastedText.charAt(0),
      code2: pastedText.charAt(1),
      code3: pastedText.charAt(2),
      code4: pastedText.charAt(3),
      code5: pastedText.charAt(4),
      code6: pastedText.charAt(5),
    });
    this.onSubmit();
  }

  focused(step) {
    if (step === 2) {
      if (this.verificationForm.controls.code1.value === '') {
        document.getElementById('code1').focus();
      }
    }
    if (step === 3) {
      if (this.verificationForm.controls.code1.value === '' || this.verificationForm.controls.code2.value === '') {
        document.getElementById('code2').focus();
      }
    }

    if (step === 4) {
      if (this.verificationForm.controls.code1.value === '' || this.verificationForm.controls.code2.value === '' || this.verificationForm.controls.code3.value === '') {
        document.getElementById('code3').focus();
      }
    }

    if (step === 5) {
      if (this.verificationForm.controls.code1.value === ''
        || this.verificationForm.controls.code2.value === ''
        || this.verificationForm.controls.code3.value === ''
        || this.verificationForm.controls.code4.value === ''
      ) {
        document.getElementById('code4').focus();
      }
    }

    if (step === 6) {
      if (this.verificationForm.controls.code1.value === ''
        || this.verificationForm.controls.code2.value === ''
        || this.verificationForm.controls.code3.value === ''
        || this.verificationForm.controls.code4.value === ''
        || this.verificationForm.controls.code5.value === ''
      ) {
        document.getElementById('code5').focus();
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.verificationForm.invalid) {
      return;
    }
    const code = this.verificationForm.value.code1 +
      this.verificationForm.value.code2 +
      this.verificationForm.value.code3 +
      this.verificationForm.value.code4 +
      this.verificationForm.value.code5 +
      this.verificationForm.value.code6;

    this.verifyOtpCode(code);

  }

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
        if (res.success) {
          this.countOtpExpireTime(300);
          this.countResendTime(60);
        } else {
          this.uiService.wrong('Something went wrong! Please try again.');
        }
      }, error => {
        console.log(error);
      });
  }

  /**
   * SENT OTP TO PHONE
   */

  sendLoginCode() {
    // Create Message Data
    const finalPhoneNo = '88' + this.phoneNo;
    this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
    const message = this.generatedOtpCode + ' is your OTP (One-Time Password) for Esquire Electronics. OTP will expire in 5 minutes.';
    // Sent Message
    this.sendSmsBySslAPi(finalPhoneNo, message, finalPhoneNo);
  }

  // Resent Verification Code...
  resendLoginCode() {
    clearInterval(this.timeInstance);
    clearInterval(this.timeInstanceExpire);
    this.sendLoginCode();
  }

  /**
   * VERIFY CODE
   */
  verifyOtpCode(code: string) {
    let message = null;
    if (this.generatedOtpCode) {
      if (code === this.generatedOtpCode) {
        this.dialogRef.close({regProgress: true});
        this.userService.userRegistration(this.registrationData);
        message = 'otp matched';
        this.storageService.storeDataToSessionStorage(DATABASE_KEY.otpCheck, message);
      } else {
        this.uiService.wrong('Your OTP code is incorrect!');
      }
    } else {
      this.dialogRef.close({regProgress: false});
      this.uiService.wrong('Your OTP code is expired! Please try again');
    }
  }


  // CountDown...
  countResendTime(time?) {
    const count = (num) => () => {
      this.countDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstance);
        this.countDown = 0;
      }
    };

    this.timeInstance = setInterval(count(time), 1000);
  }

  countOtpExpireTime(time: number) {
    const count = (num) => () => {
      this.expireCountDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstanceExpire);
        this.expireCountDown = 0;
        this.generatedOtpCode = null;
      }
    };

    this.timeInstanceExpire = setInterval(count(time), 1000);
  }

  ngOnDestroy() {
    if (this.timeInstance) {
      clearInterval(this.timeInstance);
    }

    if (this.timeInstanceExpire) {
      clearInterval(this.timeInstanceExpire);
    }

    this.registrationData = null;
    this.otpMatched = false;
  }

}
