import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UiService} from '../../services/ui.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {UtilsService} from '../../services/utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {BulkSms} from '../../interfaces/bulk-sms';
import {BulkSmsService} from '../../services/bulk-sms.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss']
})
export class PasswordRecoveryComponent implements OnInit, OnDestroy {

  phoneNo: string = null;
  otp: string = null;
  otpMatched = false;
  password: string = null;

  // Phone Verification
  timeInstance = null;
  countDown = 0;
  windowRef: any;
  // verificationCode: string;
  public sendVerificationCode = false;
  public showVerificationCodeField = false;

  // OTP
  generatedOtpCode: string;
  expireCountDown = 0;
  timeInstanceExpire = null;

  constructor(
    private userService: UserService,
    private uiService: UiService,
    private router: Router,
    private utilsService: UtilsService,
    private spinner: NgxSpinnerService,
    private bulkSmsService: BulkSmsService,
  ) {
  }

  ngOnInit(): void {
  }


  onPhoneFormSubmit(form: NgForm): void {
    if (form.invalid) {
      this.uiService.warn('Please enter your phone number');
      return;
    }

    if (!this.utilsService.checkValidPhone(form.value.phoneNo) || form.value.phoneNo.length !== 11) {
      this.uiService.warn('Please enter a valid 11 digit phone no');
      return;
    }

    this.spinner.show();
    this.phoneNo = form.value.phoneNo;
    this.checkAndGetUserByPhone();
  }

  onRecoverFormSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    this.otp = form.value.otp;
    this.verifyOtpCode();
  }

  onResetFormSubmit(form: NgForm): void {
    console.log('in my Reset function');
    if (form.invalid) {
      return;
    }

    if (form.value.password < 6) {
      this.uiService.warn('Password must be at lest 6 characters!');
      return;
    }

    if (form.value.password !== form.value.confirmPassword) {
      this.uiService.warn('Password & confirm password not matched');
      return;
    }

    this.spinner.show();
    this.password = form.value.password;
    this.editPassword();
  }


  /**
   * HTTP REQ HANDLE
   */


  private checkAndGetUserByPhone() {
    this.userService.checkAndGetUserByPhone(this.phoneNo)
      .subscribe(res => {
        const status = res.data;
        if (status) {
          // Create Message Data
          const finalPhoneNo = '88' + this.phoneNo;
          this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
          console.log('Recovery Otp Code', this.generatedOtpCode);
          const message = this.generatedOtpCode + ' is your OTP (One-Time Password) for password reset at Esquire Electronics. Please enter the OTP to the verification page. Thanks.';
          // Sent Message
          this.sendSmsBySslAPi(finalPhoneNo, message, finalPhoneNo);
        } else {
          this.spinner.hide();
          this.uiService.warn('No account found with this phone number!');
        }
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
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
        this.spinner.hide();
        if (res.success) {
          this.countTime(60);
          this.countOtpExpireTime(3000);
          this.showVerificationCodeField = true;
          this.sendVerificationCode = true;
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


  private editPassword() {
    console.log('out-in my Edit Password Function');
    this.userService.editPassword({phoneNo: this.phoneNo, password: this.password})
      .subscribe(res => {
        this.spinner.hide();
        this.uiService.success(res.message);
        console.log('in my Edit Password Function');
        this.router.navigate(['/login']);
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  /**
   * PHONE VERIFICATION
   */


  // Resent Verification Code...
  resendLoginCode() {
    clearInterval(this.timeInstance);
    clearInterval(this.timeInstanceExpire);
    // Create Message Data
    const finalPhoneNo = '88' + this.phoneNo;
    this.generatedOtpCode = this.utilsService.getRandomOtpCode6();
    const message = this.generatedOtpCode + ' is your OTP (One-Time Password) for password reset at Esquire Electronics. Please enter the OTP to the verification page. Thanks.';
    // Sent Message
    this.sendSmsBySslAPi(finalPhoneNo, message, finalPhoneNo);
  }


  /**
   * VERIFY CODE
   */
  verifyOtpCode() {
    if (this.generatedOtpCode) {
      if (this.otp === this.generatedOtpCode) {
        this.otpMatched = true;
        this.showVerificationCodeField = false;
        this.sendVerificationCode = false;
        this.otp = '';
      } else {
        this.uiService.wrong('Your OTP code is incorrect!');
      }
    } else {
      this.uiService.wrong('Your OTP code is expired! Please try again');
    }
  }

  // CountDown...
  countTime(time?) {
    const count = (num) => () => {
      this.countDown = num;
      // console.log(num);
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

    this.otpMatched = false;
  }

}
