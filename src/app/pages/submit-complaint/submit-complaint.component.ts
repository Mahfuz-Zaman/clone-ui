import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ContactUsService} from '../../services/contact-us.service';
import {UiService} from '../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-submit-complaint',
  templateUrl: './submit-complaint.component.html',
  styleUrls: ['./submit-complaint.component.scss']
})
export class SubmitComplaintComponent implements OnInit {

  @ViewChild('formTemplate') formTemplate: NgForm;

  dataForm: FormGroup;
  receivingMails = ['tuhin.tanvir_eel@esquirebd.com', 'rahman_ccd@esquirebd.com', 'online.query@esquirebd.com', 'ikram_ccd@esquirebd.com'];


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
    this.contactUsService.addSubmitComplaint(mData)
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

