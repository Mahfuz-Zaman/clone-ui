import {Component, OnInit} from '@angular/core';
import {DataService} from '../../../services/data.service';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {FileUploadService} from '../../../services/file-upload.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {forkJoin} from 'rxjs';
import {Admin} from '../../../interfaces/admin';
import {AdminService} from '../../../services/admin.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admins-control',
  templateUrl: './admins-control.component.html',
  styleUrls: ['./admins-control.component.scss']
})
export class AdminsControlComponent implements OnInit {

  adminsList: Admin[] = [];
  emptyDataList: boolean = null;
  currentAdmin: Admin = null;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private fileUploadService: FileUploadService,
    private spinner: NgxSpinnerService,
    private adminService: AdminService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshAdmin$.subscribe(() => {
      this.getAdminLists();
    });
    this.getAdminShortData();
    this.getAdminLists();
  }


  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog(data: Admin) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Delete Confirm!',
        message: 'Are you sure you want delete this data?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.parallelDeleteWithImage(data);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getAdminLists() {
    this.spinner.show();
    this.dataService.getAdminLists()
      .subscribe(res => {
        this.adminsList = res.data;
        this.emptyDataList = this.adminsList.length <= 0;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getAdminShortData() {
    this.adminService.getAdminShortData()
      .subscribe(res => {
        this.currentAdmin = res.data;
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  private parallelDeleteWithImage(data: Admin) {
    const dataPromise = this.dataService.deleteAdminById(data._id);
    const imagePromise = this.fileUploadService.removeSingleFile(data.profileImg);

    forkJoin([dataPromise, imagePromise]).subscribe(results => {
      this.uiService.success(results[0].message);
      this.reloadService.needRefreshAdmin$();
    });
  }


}
