import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {BackupRestoreService} from '../../../services/backup-restore.service';
import {Collection} from '../../../interfaces/collection';
import {Subscription} from 'rxjs';
import {ReloadService} from '../../../services/reload.service';
import {UiService} from '../../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-backup-restore',
  templateUrl: './backup-restore.component.html',
  styleUrls: ['./backup-restore.component.scss']
})
export class BackupRestoreComponent implements OnInit, OnDestroy {

  private subReload: Subscription;

  collections: Collection[] = [];

  isLoading = false;

  constructor(
    private dialog: MatDialog,
    private backupRestoreService: BackupRestoreService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {

    this.subReload = this.reloadService.refreshData$
      .subscribe(() => {
        this.getCollectionList();
      });

    this.getCollectionList();
  }

  public confirmDialog(type: string, collectionName: string, force?: boolean) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Action',
        message: type === 'backup' ? 'Are you sure you want backup this data?' : 'Are you sure you want restore this data?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (type === 'backup') {
          this.backupCollection(collectionName);
        } else {
          this.restoreCollection(collectionName, force);
        }
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getCollectionList() {
    this.spinner.show();
    this.backupRestoreService.getCollectionList()
      .subscribe(res => {
        this.spinner.hide();
        this.collections = res.data;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private backupCollection(collectionName: string) {
    this.isLoading = true;
    this.spinner.show();
    const data = { collectionName };
    this.backupRestoreService.backupCollection(data)
      .subscribe(res => {
        this.spinner.hide();
        this.isLoading = false;
        if (res.success) {
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.isLoading = false;
        this.spinner.hide();
        console.log(error);
      });
  }

  private restoreCollection(collectionName: string, force?: boolean) {
    this.isLoading = true;
    this.spinner.show();
    const data = { collectionName, force: force ? force : false };
    this.backupRestoreService.restoreCollection(data)
      .subscribe(res => {
        this.spinner.hide();
        this.isLoading = false;
        if (res.success) {
          this.uiService.success(res.message);
          this.reloadService.needRefreshData$();
        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        this.isLoading = false;
        this.spinner.hide();
        console.log(error);
      });
  }

  ngOnDestroy() {
    if (this.subReload) {
      this.subReload.unsubscribe();
    }
  }

}
