import {Component, OnDestroy, OnInit} from '@angular/core';
import {Discussion} from '../../../interfaces/discussion';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {DiscussionService} from '../../../services/discussion.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {NgxSpinnerService} from 'ngx-spinner';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Pagination} from '../../../interfaces/pagination';

@Component({
  selector: 'app-discussion',
  templateUrl: './discussion.component.html',
  styleUrls: ['./discussion.component.scss']
})
export class DiscussionComponent implements OnInit, OnDestroy {
  // Subscriptions
  private subAcRoute: Subscription;
  private subDataOne: Subscription;

  allDiscussion: Discussion [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  constructor(
    private dialog: MatDialog,
    private discussionService: DiscussionService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshDiscussion$
      .subscribe(() => {
        this.getAllDiscussions();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllDiscussions();
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
        message: 'Are you sure you want delete this discussion?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteDiscussionByDiscussionId(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllDiscussions() {
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.subDataOne = this.discussionService.getAllDiscussions(pagination)
      .subscribe(res => {
        this.allDiscussion = res.data;
        this.totalProducts = res.count;
        this.totalProductsStore = res.count;
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteDiscussionByDiscussionId(id: string) {
    this.discussionService.deleteDiscussionByDiscussionId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshDiscussion$();
      }, error => {
        console.log(error);
      });
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
  }


}
