import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {User} from '../../../interfaces/user';
import {ActivatedRoute, Router} from '@angular/router';
import {ReloadService} from '../../../services/reload.service';
import {Pagination} from '../../../interfaces/pagination';
import {UserDataService} from '../../../services/user-data.service';
import {CustomerEditDialogComponent} from './customer-edit-dialog/customer-edit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import {NgxSpinnerService} from 'ngx-spinner';
import {UiService} from '../../../services/ui.service';
import {UtilsService} from '../../../services/utils.service';
import {Select} from '../../../interfaces/select';
import {GENDERS} from '../../../core/utils/app-data';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {MatSelect} from '@angular/material/select';
import {EMPTY, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatOptionSelectionChange} from '@angular/material/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit, AfterViewInit {

  // Subscriptions
  private subAcRoute: Subscription;
  private subForm: Subscription;
  private subUser: Subscription;

  customers: User[] = [];
  holdPrevData: User[] = [];

  userStatus: Select[] = [
    {value: true, viewValue: 'Active'},
    {value: false, viewValue: 'Inactive'},
  ];

  userGenders: Select[] = GENDERS;
  // Filter Data
  today = new Date();

  // Form Group
  dataFormRangeReg = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // SEARCH AREA
  searchProducts: User[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // Query
  query: any[] = [];

  // Select View Child
  @ViewChild('matGenderSelect') matGenderSelect: MatSelect;
  @ViewChild('matStatusSelect') matStatusSelect: MatSelect;


  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  // DOWNLOADABLE
  dataTypeFormat = 'exel';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private reloadService: ReloadService,
    private customerService: UserDataService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private uiService: UiService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {

    // GET PAGE FROM QUERY PARAM
    this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getCustomerList();
    });

    this.reloadService.refreshUser$
      .subscribe(() => {
        this.getCustomerList();
      });

    // Get Gallery Data
    this.getCustomerList();
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue.pipe(
      // map(t => t.searchTerm)
      // filter(() => this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data;
        if (this.searchQuery === '' || this.searchQuery === null) {
          this.searchProducts = [];
          this.customers = this.holdPrevData;
          this.totalProducts = this.totalProductsStore;
          this.searchProducts = [];
          this.searchQuery = null;
          return EMPTY;
        }
        this.isLoading = true;
        const pagination: Pagination = {
          pageSize: this.productsPerPage.toString(),
          currentPage: this.currentPage.toString()
        };
        return this.customerService.getSearchUsers(data, pagination);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.customers = this.searchProducts;
        this.totalProducts = res.count;
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}});
      }, error => {
        console.log(error);
        this.isLoading = false;
      });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getCustomerList() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    const mQuery = this.query.length > 0 ? {$and: this.query} : null;

    this.customerService.getCustomerLists(pagination, mQuery)
      .subscribe(res => {
        this.spinner.hide();
        this.customers = res.data;
        this.holdPrevData = res.data;
        this.totalProducts = res.count;
        this.totalProductsStore = res.count;
        window.scrollTo(0, 0);
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * ON REMOVE
   */
  onClearFilter() {
    this.matGenderSelect.value = null;
    this.matStatusSelect.value = null;
    this.dataFormRangeReg.reset();
    this.query = [];
    this.router.navigate([], {queryParams: {page: null}, queryParamsHandling: 'merge'});
    this.getCustomerList();
  }


  openUpdateOrderDialog(data: User) {
    this.dialog.open(CustomerEditDialogComponent, {
      data,
      panelClass: ['theme-dialog'],
      autoFocus: false,
      disableClose: false
    });
  }

  exportDataToFile() {
    this.exportToExcel();
  }

  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel() {
    this.spinner.show();
    this.customerService.getCustomerLists()
      .subscribe(res => {
        const allData = res.data as User[];
        const mData = allData.map(m => {
          return {
            fullName: m.fullName,
            username: m.username,
            gender: m.gender ? m.gender : 'N/A',
            email: m.email ? m.email : 'N/A',
            phoneNo: m.phoneNo ? m.phoneNo : 'N/A',
            address: m.address ? m.address : 'N/A',
            hasAccess: m.hasAccess ? 'Yes' : 'No',
            registrationType: m.registrationType,
            isPhoneVerified: m.isPhoneVerified,
            isEmailVerified: m.isEmailVerified,
            occupation: m.occupation ? m.occupation : 'N/A',
            createdAt: this.utilsService.getDateString(m.createdAt),
            birthdate: m.birthdate ? this.utilsService.getDateString(m.birthdate) : 'N/A',
          };
        });

        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Customers');
        XLSX.writeFile(wb, `Customers_Exports_${date}.xlsx`);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * SELECTION CHANGE
   */
  onSelectGender(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const qData = {gender: event.source.value};

      const index = this.query.findIndex(x => x.hasOwnProperty('gender'));
      if (index < 0) {
        this.query.push(qData);
      } else {
        this.query[index] = {gender: event.source.value};
      }
      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getCustomerList();
      }
    }
  }

  onSelectStatus(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      const qData = {hasAccess: event.source.value};
      const index = this.query.findIndex(x => x.hasOwnProperty('hasAccess'));
      if (index < 0) {
        this.query.push(qData);
      } else {
        this.query[index] = {hasAccess: event.source.value};
      }
      // console.log(this.query);
      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getCustomerList();
      }
    }
  }

  /**
   * FILTER DATA With Date Range
   */

  endChangeRegDateRange(event: MatDatepickerInputEvent<any>) {
    if (event.value) {
      const startDate = this.utilsService.getDateString(this.dataFormRangeReg.value.start);
      const endDate = this.utilsService.getDateString(this.dataFormRangeReg.value.end);

      const qData = {createdAt: {$gte: startDate, $lte: endDate}};
      const index = this.query.findIndex(x => x.hasOwnProperty('createdAt'));
      if (index < 0) {
        this.query.push(qData);
      } else {
        this.query[index] = {createdAt: {gte: startDate, $lte: endDate}};
      }

      // console.log(this.query);
      if (this.currentPage > 1) {
        this.router.navigate([], {queryParams: {page: 1}});
      } else {
        this.getCustomerList();
      }
    }
  }

  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }

    if (this.subUser) {
      this.subUser.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }


}
