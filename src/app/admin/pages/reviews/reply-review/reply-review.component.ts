import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UiService} from '../../../../services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {ReloadService} from '../../../../services/reload.service';
import {ReviewControlService} from '../../../../services/review-control.service';
import {ReviewControl} from '../../../../interfaces/review-control';
import {Select} from '../../../../interfaces/select';

@Component({
  selector: 'app-reply-review',
  templateUrl: './reply-review.component.html',
  styleUrls: ['./reply-review.component.scss']
})
export class ReplyReviewComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;
  private sub: Subscription;

  isLoading: any;

  // Store Data from param
  id?: string;
  review: ReviewControl = null;

  reviewStatus: Select[] = [
    {value: false, viewValue: 'Not Approve'},
    {value: true, viewValue: 'Approve'},
  ];

  constructor(
    private fb: FormBuilder,
    private uiService: UiService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private reviewControlService: ReviewControlService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {

    this.dataForm = this.fb.group({
      status: [null, Validators.required],
      reply: [null],
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getReviewByReviewId();
      }
    });

  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue({status: this.review.status, reply: this.review.reply});
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }
    const finalData = {
      ...this.dataForm.value,
      ...{
      _id: this.review._id,
        replyDate: this.utilsService.getDateString(new Date())
    }};
    this.editReview(finalData);

  }


  /**
   * HTTP REQ
   */

  private getReviewByReviewId() {
    this.reviewControlService.getReviewByReviewId(this.id)
      .subscribe(res => {
        this.review = res.data;
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  private editReview(data: ReviewControl) {
    this.reviewControlService.editReview(data)
      .subscribe(res => {
       this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }


}
