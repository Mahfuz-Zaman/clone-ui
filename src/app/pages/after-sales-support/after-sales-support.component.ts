import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ContactUsService} from '../../services/contact-us.service';
import {UiService} from '../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-after-sales-support',
  templateUrl: './after-sales-support.component.html',
  styleUrls: ['./after-sales-support.component.scss']
})
export class AfterSalesSupportComponent implements OnInit {

  @ViewChild('formTemplate') formTemplate: NgForm;

  dataForm: FormGroup;
  receivingMails = ['contact@softlabit.com', 'contact@softlabit.com', 'contact@softlabit.com', 'contact@softlabit.com', 'contact@softlabit.com'];


  constructor(
    private fb: FormBuilder,
    private contactUsService: ContactUsService,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.initDataForm();
  }


  private initDataForm() {
    this.dataForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      phoneNo: ['', Validators.required],
      address: ['', Validators.required],
      invoiceNumber: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      emailSent: [false],
    });
  }


  onSubmit() {
    if (this.dataForm.invalid) {
      return;
    }
    this.addContactUs();
  }

  /**
   * HTTP REQ HANDLE
   */
  private addContactUs() {
    const mData = {
      ...this.dataForm.value,
      ...{
        receivingMails: this.receivingMails
      }
    };

    this.spinner.show();
    this.contactUsService.addAfterSaleSupport(mData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.formTemplate.resetForm();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


}

