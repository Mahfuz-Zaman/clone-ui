import {Component, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {ReviewControlService} from '../../../services/review-control.service';
import {ReviewControl} from '../../../interfaces/review-control';

// @ts-ignore
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  allReviews: ReviewControl[] = [];

  constructor(
    private dialog: MatDialog,
    private reviewControlService: ReviewControlService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshReviewControl$
      .subscribe(() => {
        this.getAllReviews();
      });
    this.getAllReviews();
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
        this.deleteReviewByReviewId(data);
      }
    });
  }

  // openComponentDialog(product: string) {
  //
  // }

  /**
   * HTTP REQ HANDLE
   */

  private getAllReviews() {
    this.reviewControlService.getAllReviews()
      .subscribe(res => {
        this.allReviews = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteReviewByReviewId(id: string) {
    this.reviewControlService.deleteReviewByReviewId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshReviewControl$();
      }, error => {
        console.log(error);
      });
  }
}
