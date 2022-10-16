import {Component, OnInit, ViewChild} from '@angular/core';
import {Faq} from '../../../../interfaces/faq';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {TextEditorCtrService} from '../../../../services/text-editor-ctr.service';
import {FaqService} from '../../../../services/faq.service';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.scss']
})
export class AddFaqComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;
  faq: Faq;

  // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private faqService: FaqService,
    public textEditorCtrService: TextEditorCtrService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      title: [null, Validators.required],
      description: [null, Validators.required],

    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getFaqByFaqId();
      }
    });
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.faq);

    if (this.storageService.getStoredInput('FAQ_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('FAQ_INPUT'));
    }

  }


  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.faq) {
      const finalData = {...this.dataForm.value, ...{_id: this.faq._id}};
      this.editFaqData(finalData);
    } else {
      this.addFaq(this.dataForm.value);
    }
  }


  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'FAQ_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addFaq(data: Faq) {
    this.spinner.show();
    this.faqService.addFaq(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('FAQ_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private getFaqByFaqId() {
    this.spinner.show();
    this.faqService.getFaqByFaqId(this.id)
      .subscribe(res => {
        this.faq = res.data;
        if (this.faq) {
          this.setFormData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private editFaqData(data: Faq) {
    this.spinner.show();
    this.faqService.editFaqData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('FAQ_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('FAQ_INPUT');
    }
  }

}
