import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Discussion} from '../../../../interfaces/discussion';
import {UiService} from '../../../../services/ui.service';
import {User} from '../../../../interfaces/user';

@Component({
  selector: 'app-discussion-form',
  templateUrl: './discussion-form.component.html',
  styleUrls: ['./discussion-form.component.scss']
})
export class DiscussionFormComponent implements OnInit {

  @Input() user: User;
  @Output() onSubmitForm = new EventEmitter<any>();

  // Discussion
  discussionForm: FormGroup;
  @ViewChild('templateForm') templateForm: NgForm;

  userProfileImg = '/assets/images/avatar/user-cmnt.png';

  constructor(
    public uiService: UiService,
    public fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initDiscussionForm();
  }

  /**
   * INIT FORM
   */
  private initDiscussionForm() {
    this.discussionForm = this.fb.group({
      name: [null],
      email: [null, Validators.email],
      comment: [null]
    });

    if (this.user) {
      this.patchFormData();
    }
  }

  private patchFormData() {
    this.discussionForm.patchValue(
      {name: this.user.fullName, email: this.user.email},
    );
    if (this.user.profileImg) {
      this.userProfileImg = this.user.profileImg;
    }
  }

  /**
   * DISCUSSION AREA
   */
  onSubmitDiscussion() {
    if (this.discussionForm.invalid) {
      this.uiService.warn('Please complete all the required field');
      return;
    }

    const mData = {
      ...this.discussionForm.value,
      ...{
        user: this.user ?  this.user._id : null,
        profileImage: this.user ?  this.user.profileImg : null,
      }
    };
    this.onSubmitForm.emit(mData);
    this.templateForm.resetForm();

  }

}
