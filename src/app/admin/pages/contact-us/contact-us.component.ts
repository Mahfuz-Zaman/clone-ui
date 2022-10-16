import {Component, OnInit} from '@angular/core';
import {ReloadService} from '../../../services/reload.service';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Pagination} from '../../../interfaces/pagination';
import {ContactUs} from '../../../interfaces/contact-us';
import {ContactUsService} from '../../../services/contact-us.service';

@Component({
  selector: 'app-newsletter',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  public contactUsData: ContactUs[] = [];
  holdPrevData: ContactUs[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 10;

  constructor(
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private uiService: UiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private contactUsService: ContactUsService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshContactUs$.subscribe(() => {
      this.getNewsletters();
    });

    this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getNewsletters();
    });
  }

  public remove(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: 'Are you sure you want remove this data?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteNewsletter(id);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */
  private getNewsletters() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.contactUsService.getAllContactUs(pagination)
      .subscribe(res => {
        this.contactUsData = res.data;
        this.holdPrevData = res.data;
        this.totalProducts = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private deleteNewsletter(id: string) {
    this.contactUsService.deleteContactUsById(id)
      .subscribe(res => {
        this.reloadService.needRefreshContactUs$();
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }

  /**
   * NGX PAGINATION CHANGED
   */

  public onPageChanged(event) {
    this.router.navigate([], {queryParams: {page: event}});
  }



}
