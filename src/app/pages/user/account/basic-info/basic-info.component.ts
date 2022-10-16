import { Component, OnInit, OnDestroy } from '@angular/core';
import {User} from '../../../../interfaces/user';
import {MatDialog} from '@angular/material/dialog';
import {UserDataService} from '../../../../services/user-data.service';
import {ReloadService} from '../../../../services/reload.service';
import {EditBasicInfoComponent} from '../../../../shared/dialog-view/edit-basic-info/edit-basic-info.component';
import { Subscription } from 'rxjs';
import {PhoneForceComponent} from '../../../../shared/dialog-view/phone-force/phone-force.component';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit, OnDestroy {
  //Subscription
  private subReloadService : Subscription;
  private subUserDataService : Subscription;

  user: User = null;
  phoneNo: string = null;

  constructor(
    private dialog: MatDialog,
    protected userDataService: UserDataService,
    private reloadService: ReloadService
  ) {
  }

  ngOnInit(): void {
    this.subReloadService = this.reloadService.refreshUser$.subscribe(() => {
      this.getLoggedInUserInfo();
    });
    this.getLoggedInUserInfo();

  }

  private getLoggedInUserInfo() {
    const select = '-password';
    this.subUserDataService = this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
        this.phoneNo = res.data.phoneNo;
        if (!this.phoneNo) {
          this.dialog.open(PhoneForceComponent, {
            data: this.user,
            panelClass: ['theme-dialog'],
            maxHeight: '600px',
            maxWidth: '450px',
            // height: '60%',
            autoFocus: false,
            disableClose: true
          });
        }
      }, error => {
        console.log(error);
      });
  }

  openNewDialog() {
    this.dialog.open(EditBasicInfoComponent, {
      data: this.user,
      panelClass: ['theme-dialog'],
      height: '60%',
      autoFocus: false,
      disableClose: false
    });
  }

  ngOnDestroy(): void {
      if (this.subReloadService) {
        this.subReloadService.unsubscribe();
      }
      if (this.subUserDataService) {
        this.subUserDataService.unsubscribe();
      }
  }
}
