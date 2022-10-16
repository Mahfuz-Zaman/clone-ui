import {Component, OnInit} from '@angular/core';
import {Faq} from '../../../interfaces/faq';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FaqService} from '../../../services/faq.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  // Subscriptions
  private subAcRoute: Subscription;
  // Pagination
  currentPage = 1;

  allFaqs: Faq[] = [];

  constructor(
    private dialog: MatDialog,
    private faqService: FaqService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshFaq$
      .subscribe(() => {
        this.getAllFaq();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllFaq();
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
        this.deleteFaqByFaqId(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllFaq() {
    this.faqService.getAllFaq()
      .subscribe(res => {
        this.allFaqs = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteFaqByFaqId(id: string) {
    this.faqService.deleteFaqByFaqId(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshBlog$();
      }, error => {
        console.log(error);
      });
  }

  /**
   * ON DESTROY
   */
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
  }


}
