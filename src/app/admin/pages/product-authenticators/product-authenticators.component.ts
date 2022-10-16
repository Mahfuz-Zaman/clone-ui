import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EMPTY, Subscription} from 'rxjs';
import {Warranty} from '../../../interfaces/warranty';
import {NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {Pagination} from '../../../interfaces/pagination';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import * as XLSX from 'xlsx';
import {ProductAuthenticatorService} from '../../../services/product-authenticator.service';
import {ProductAuthenticator} from '../../../interfaces/product-authenticator';

@Component({
  selector: 'app-product-authenticators',
  templateUrl: './product-authenticators.component.html',
  styleUrls: ['./product-authenticators.component.scss']
})
export class ProductAuthenticatorsComponent implements OnInit, AfterViewInit, OnDestroy {

  // Subscriptions
  private subAcRoute: Subscription;
  private subForm: Subscription;

  productAuthenticators: ProductAuthenticator[] = [];
  holdPrevData: ProductAuthenticator[] = [];


  // DOWNLOADABLE
  dataTypeFormat = 'excel';

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: ProductAuthenticator[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private dialog: MatDialog,
    private productAuthenticatorService: ProductAuthenticatorService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshWarrantyList$
      .subscribe(() => {
        this.getAllProductAuthenticator();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllProductAuthenticator();
    });
  }

  ngAfterViewInit(): void {
    const formValue = this.searchForm.valueChanges;

    this.subForm = formValue.pipe(
      pluck('searchTerm'),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(data => {
        this.searchQuery = data;
        if (this.searchQuery === '' || this.searchQuery === null || !this.searchQuery.trim()) {
          this.searchProducts = [];
          this.productAuthenticators = this.holdPrevData;
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
        return this.productAuthenticatorService.getSearchProductAuthenticator(data, pagination);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.productAuthenticators = this.searchProducts;
        this.totalProducts = res.count;
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}});
      }, error => {
        this.isLoading = false;
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
        // console.log('Data should be deleted');
        this.deleteProductAuthenticator(data);
      }
    });
  }

  public openConfirmUploadDialog(data: ProductAuthenticator[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManyProductAuthenticator(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllProductAuthenticator() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.productAuthenticatorService.getAllProductAuthenticator(pagination)
      .subscribe(res => {
        this.productAuthenticators = res.data;
        this.totalProducts = res.count;
        this.holdPrevData = res.data;
        this.totalProductsStore = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private insertManyProductAuthenticator(data: ProductAuthenticator[]) {
    this.spinner.show();
    this.productAuthenticatorService.insertManyProductAuthenticator(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshWarrantyList$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * DELETE METHOD HERE
   */
  private deleteProductAuthenticator(id: string) {
    this.spinner.show();
    this.productAuthenticatorService.deleteProductAuthenticator(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshWarrantyList$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  /**
   * PAGINATION CHANGE
   */
  public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
  }


  /**
   * IMPORT EXCEL DATA
   * FILE CHANGE EVENT
   */

  onFileChange(ev) {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    const file = ev.target.files[0];
    if (this.dataTypeFormat === 'excel') {
      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, {type: 'binary'});
        jsonData = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        // const dataString = JSON.stringify(jsonData) as any;

        // Modify Attributes
        const datas = jsonData.productAuthenticators;
        const mData: ProductAuthenticator[] = datas.map(m => {
          const mImei = m.imei ?  m.imei.toString().trim() : '';
          const mSn = m.sn ? m.sn.toString().trim() : '';
          return {
            imei: mImei,
            sn: mSn
          } as ProductAuthenticator;
        });
        console.log(mData);
        this.openConfirmUploadDialog(mData);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const warranties = JSON.parse(reader.result.toString());
        const mData: Warranty[] = warranties.map(m => {
          const invoiceNumber = m.invoiceNumber.toString().trim();
          return {
            ...m,
            ...{
              invoiceNumber,
              activationDate: this.excelDateToJSDate(m.activationDate)
            }
          } as Warranty;
        });
        this.openConfirmUploadDialog(mData);
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }


  exportDataToFile() {
    if (this.dataTypeFormat === 'excel') {
      this.exportToExcel();
    }
  }


  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel() {
    this.spinner.show();
    this.productAuthenticatorService.getAllProductAuthenticator()
      .subscribe(res => {
        const allData = res.data.map(m => {
          return {
            imei: m.imei,
            sn: m.sn
          } as ProductAuthenticator;
        });
        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'productAuthenticators');
        XLSX.writeFile(wb, `Product_Authenticator_Backup_${date}.xlsx`);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * EXCEL DATE TO NORMAL DATE
   */
  excelDateToJSDate(serial: any) {
    if (typeof serial === 'string') {
      return serial;
    } else {
      const utcDate = Math.floor(serial - 25569);
      const utcValue = utcDate * 86400;
      const dateInfo = new Date(utcValue * 1000);

      const fractionalDay = serial - Math.floor(serial) + 0.0000001;

      let totalSeconds = Math.floor(86400 * fractionalDay);

      const seconds = totalSeconds % 60;

      totalSeconds -= seconds;

      const hours = Math.floor(totalSeconds / (60 * 60));
      const minutes = Math.floor(totalSeconds / 60) % 60;

      const d = new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate(), hours, minutes, seconds);
      return this.utilsService.getDateString(d);

    }
  }

  /**
   * GET MODIFY PHONE NO FOR EXCEL
   */

  protected getModifyPhoneNo(phoneNo: string) {
    if (phoneNo.slice(0, 2) === '88') {
      return phoneNo.substring(2);
    } else if (phoneNo.slice(0, 1) !== '0') {
      return '0' + phoneNo;
    } else {
      return phoneNo;
    }
  }


  /**
   * ON DESTROY
   */
  ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }
}
