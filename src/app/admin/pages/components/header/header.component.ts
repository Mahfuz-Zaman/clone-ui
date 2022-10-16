import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AdminService} from '../../../../services/admin.service';
import {Admin} from '../../../../interfaces/admin';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() sidenavNavToggle = new EventEmitter();

  adminData: Admin = null;

  constructor(
    private adminService: AdminService
  ) {
  }

  ngOnInit() {
    this.getUserData();
  }


  onToggleSidenav() {
    this.sidenavNavToggle.emit();
  }

  adminLogOut() {
    this.adminService.adminLogOut();
  }

  /**
   * HTTP Requested Data
   */
  private getUserData() {
    this.adminService.getAdminShortData()
      .subscribe(res => {
        this.adminData = res.data;
      });
  }
}
