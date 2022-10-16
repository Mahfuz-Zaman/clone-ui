import { Component, OnInit } from '@angular/core';
import {ReviewControl} from '../../../../interfaces/review-control';
import {ReviewControlService} from '../../../../services/review-control.service';
import {UiService} from '../../../../services/ui.service';
import {ReloadService} from '../../../../services/reload.service';
import {UserDataService} from '../../../../services/user-data.service';
import {User} from '../../../../interfaces/user';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  allReviews: ReviewControl[] = [];
  user: User = null;

  constructor(
    private reviewControlService: ReviewControlService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private userDataService: UserDataService,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshReviewControl$
      .subscribe(() => {
        this.getAllReviewsByQuery();
      });

    this.userDataService.getLoggedInUserInfo('fullName')
      .subscribe(res => {
        this.user = res.data;
        if (this.user) {
          this.getAllReviewsByQuery();
        }
      }, error => {
        console.log(error);
      });

  }


  private getAllReviewsByQuery() {
    const query = {
      user: this.user._id
    };
    this.reviewControlService.getAllReviewsByQuery(null, null, query)
      .subscribe(res => {
        this.allReviews = res.data;
        // console.log(this.allReviews);
      }, error => {
        console.log(error);
      });
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        // this.deleteReviewByReviewId(data);
      }
    });
  }


}
