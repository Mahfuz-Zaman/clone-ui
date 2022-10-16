import { Component, OnInit } from '@angular/core';
import {User} from '../../../../interfaces/user';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {ReloadService} from '../../../../services/reload.service';
import {UserDataService} from '../../../../services/user-data.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  // Store Data from param
  id?: string;
  customer: User;

  // Destroy Session
  needSessionDestroy = true;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  imgPlaceHolder = '/assets/images/avatar/user_low.png';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
    private customerService: UserDataService,
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getUserByUserID();
      }
    });
  }

  private getUserByUserID() {
    this.customerService.getUserByUserID(this.id)
      .subscribe(res => {
        // console.log('Customer Details');
        this.customer = res.data;
        this.imgPlaceHolder = res.data.profileImg;
        // console.log(res.data);
      }, error => {
        console.log(error);
      });
  }

}
