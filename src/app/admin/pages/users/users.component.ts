import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Admin} from '../../../interfaces/admin';
import {AdminDataService} from '../../../services/admin-data.service';
import {ReloadService} from '../../../services/reload.service';
import {UiService} from '../../../services/ui.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  // Store Data
  users: Admin[] = [];
  currentUser?: Admin;



  constructor(
      private dialog: MatDialog,
      private adminDataService: AdminDataService,
      private reloadService: ReloadService,
      private uiService: UiService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshAdmin$.subscribe(() => {
      this.getUserList();
    });
    this.getUserList();
    this.getLoginAdminInfo();
  }

  /**
   * HTTP REQ HANDLE
   */
  private getUserList() {
    this.adminDataService.getAllAdmin()
        .subscribe(res => {
          this.users = res.data;
        }, error => {
          console.log(error);
        });
  }

  private getLoginAdminInfo() {
    this.adminDataService.getLoginAdminInfo()
        .subscribe(res => {
          this.currentUser = res.data;
        }, error => {
          console.log(error);
        });
  }

  private deleteAdmin(userId) {
    this.adminDataService.deleteAdmin(userId)
        .subscribe(res => {
          this.uiService.success(res.message);
          this.reloadService.needRefreshAdmin$();
        }, error => {
          console.log(error);
        });
  }


  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: Admin) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteAdmin(data._id);
      }
    });
  }
}
