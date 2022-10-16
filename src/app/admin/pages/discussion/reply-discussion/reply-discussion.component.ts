import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Select} from '../../../../interfaces/select';
import {Discussion, DiscussionReply} from '../../../../interfaces/discussion';
import {UiService} from '../../../../services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {DiscussionService} from '../../../../services/discussion.service';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-reply-discussion',
  templateUrl: './reply-discussion.component.html',
  styleUrls: ['./reply-discussion.component.scss']
})
export class ReplyDiscussionComponent implements OnInit, OnDestroy {

  private subRoute: Subscription;
  private subDataOne: Subscription;

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm?: FormGroup;

  isLoading: any;

  // Store Data from param
  id?: string;
  discussion: Discussion = null;

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
    private discussionService: DiscussionService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      status: [null, Validators.required],
      reply: [null],
    });

    // GET ID FORM PARAM
    this.subRoute = this.activatedRoute.paramMap.subscribe((param) => {
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
    // console.log(this.discussion);
    const replayLv1 = this.discussion.reply.map(m => {
      if (m.isAdmin) {
        return m.comment;
      }
    });
    this.dataForm.patchValue({status: this.discussion.status, reply: replayLv1});
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }

    const mData = this.discussion;
    if (this.dataForm.value.status) {
      const replyLv1: DiscussionReply = {
        isAdmin: true,
        comment: this.dataForm.value.reply,
        reply: [],
        user: null,
        replyDate: new Date(),
        name: 'Esquire Electronics',
        vote: 0,
        status: true,
        profileImage: null,
        email: null
      };
      mData.reply.push(replyLv1);
    }

    const finalData = {...mData, ...{status: this.dataForm.value.status}};

    this.editDiscussion(finalData);

  }

  /**
   * HTTP REQ
   */

  private getReviewByReviewId() {
    this.spinner.show();
    this.subDataOne = this.discussionService.getDiscussionByDiscussionId(this.id)
      .subscribe(res => {
        this.spinner.hide();
        this.discussion = res.data;
        this.setFormData();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private editDiscussion(data: Discussion) {
    this.spinner.show();
    this.discussionService.editDiscussion(data)
      .subscribe(res => {
        this.spinner.hide();
        this.uiService.success(res.message);
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subRoute) {
      this.subRoute.unsubscribe();
    }
  }

}
