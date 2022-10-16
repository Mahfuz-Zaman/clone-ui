import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ContactUsService} from '../../services/contact-us.service';
import {UiService} from '../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  @ViewChild('formTemplate') formTemplate: NgForm;

  dataForm: FormGroup;

  queryTypes: any[] = [
    {value: 'General Query', emails: ['tuhin.tanvir_eel@esquirebd.com', 'online.query@esquirebd.com']},
    {value: 'Corporate Query', emails: ['tuhin.tanvir_eel@esquirebd.com', 'mkarim@esquirebd.com', 'online.query@esquirebd.com']},
    {value: 'Dealership Query', emails: ['tuhin.tanvir_eel@esquirebd.com', 'mkarim@esquirebd.com', 'online.query@esquirebd.com']},
    {value: 'After Sales Support', emails: ['tuhin.tanvir_eel@esquirebd.com', 'rahman_ccd@esquirebd.com', 'online.query@esquirebd.com', 'ikram_ccd@esquirebd.com']},
    {value: 'Online Purchase', emails: ['tuhin.tanvir_eel@esquirebd.com', 'online.query@esquirebd.com']},
    {value: 'Other Query', emails: ['tuhin.tanvir_eel@esquirebd.com', 'online.query@esquirebd.com']},
  ];


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
      queryType: ['', Validators.required],
      subject: ['', Validators.required],
      message: ['', Validators.required],
      emailSent: [false],
    });
  }


  onSubmit() {
    // console.log(this.dataForm.value);
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
        queryType: this.dataForm.value.queryType.value,
        receivingMails: this.dataForm.value.queryType.emails
      }
    };
    this.spinner.show();
    this.contactUsService.addContactUs(mData)
      .subscribe(res => {
        // console.log(res);
        this.uiService.success(res.message);
        this.formTemplate.resetForm();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


}

