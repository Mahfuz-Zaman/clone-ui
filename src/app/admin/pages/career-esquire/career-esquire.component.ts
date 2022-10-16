import { Component, OnInit } from '@angular/core';
import {CareerEsquire} from '../../../interfaces/career-esquire';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CareerEsquireService} from '../../../services/career-esquire.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-career-esquire',
  templateUrl: './career-esquire.component.html',
  styleUrls: ['./career-esquire.component.scss']
})
export class CareerEsquireComponent implements OnInit {

  // Subscriptions
  private subAcRoute: Subscription;

  // Pagination
  currentPage = 1;

  // DOWNLOADABLE
  dataTypeFormat = 'json';

  allCareerEsquire: CareerEsquire[] = [];

  constructor(
    private dialog: MatDialog,
    private careerEsquireService: CareerEsquireService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshCareerEsquire$
      .subscribe(() => {
        this.getAllCareerEsquire();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllCareerEsquire();
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
        this.deleteCareerEsquire(data);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCareerEsquire() {
    this.careerEsquireService.getAllCareerEsquire()
      .subscribe(res => {
        this.allCareerEsquire = res.data;
      }, error => {
        console.log(error);
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteCareerEsquire(id: string) {
    this.careerEsquireService.deleteCareerEsquire(id)
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
