import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UiService} from '../../../services/ui.service';
import {UserService} from '../../../services/user.service';
import {UserDataService} from '../../../services/user-data.service';
import {ReloadService} from '../../../services/reload.service';
import {Review} from '../../../interfaces/review';
import {ReviewControl} from '../../../interfaces/review-control';
import {UtilsService} from '../../../services/utils.service';
import {ReviewControlService} from '../../../services/review-control.service';

@Component({
  selector: 'app-rating-and-review',
  templateUrl: './rating-and-review.component.html',
  styleUrls: ['./rating-and-review.component.scss']
})
export class RatingAndReviewComponent implements OnInit {
  // Rating
  @Input() pageUrl: string = null;
  @Input() productId: string = null;
  @Input() rating = 0;
  @ViewChild('formElement') formElRef: NgForm;


  constructor(
    private uiService: UiService,
    public userService: UserService,
    public userDataService: UserDataService,
    public reloadService: ReloadService,
    public utilsService: UtilsService,
    public reviewControlService: ReviewControlService,
  ) {
  }

  ngOnInit(): void {
  }


  onRatingChanged(rating) {
    this.rating = rating;
  }

  /**
   * ON SUBMIT
   */
  onSubmitReview(formData: NgForm) {
    if (formData.invalid) {
      this.uiService.warn('Please write your review');
      return;
    }
    if (this.rating === 0) {
      this.uiService.warn('Please rate with star');
      return;
    }

    const data: ReviewControl = {
      review: formData.value.text,
      rating: this.rating,
      reviewDate: this.utilsService.getDateString(new Date()),
      product: this.productId,
      status: false,
      replyDate: null,
      reply: null
    };

    this.addReview(data);
  }

  /**
   * RESET
   */
  private reset() {
    this.rating = 0;
    this.formElRef.resetForm();
  }

  /**
   * HTTP REQ HANDLE
   */

  private addReview(review: ReviewControl) {
    this.reviewControlService.addReview(review)
      .subscribe(res => {
        this.uiService.success('Your review is under review');
        this.reloadService.needRefreshReviewControl$();
        this.reset();
      }, error => {
        console.log(error);
      });
  }


}
