import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {Pagination} from '../../../interfaces/pagination';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {EMPTY, Subscription} from 'rxjs';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import * as XLSX from 'xlsx';
import {DownloadJsonDialogComponent} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.component';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';
import {WarrantyService} from '../../../services/warranty.service';
import {Warranty} from '../../../interfaces/warranty';

@Component({
  selector: 'app-warranty-dashboard',
  templateUrl: './warranty-dashboard.component.html',
  styleUrls: ['./warranty-dashboard.component.scss']
})
export class WarrantyDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  // Subscriptions
  private subAcRoute: Subscription;
  private subForm: Subscription;

  warranties: Warranty[] = [];
  holdPrevData: Warranty[] = [];


  // DOWNLOADABLE
  dataTypeFormat = 'excel';

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: Warranty[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  constructor(
    private dialog: MatDialog,
    private warrantyService: WarrantyService,
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
        this.getAllWarranty();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllWarranty();
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
          this.warranties = this.holdPrevData;
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
        return this.warrantyService.getSearchWarranty(data, pagination);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.warranties = this.searchProducts;
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
        this.deleteWarranty(data);
      }
    });
  }

  public openConfirmUploadDialog(data: Warranty[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManyWarranty(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllWarranty() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.warrantyService.getAllWarranty(pagination)
      .subscribe(res => {
        this.warranties = res.data;
        this.totalProducts = res.count;
        this.holdPrevData = res.data;
        this.totalProductsStore = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private insertManyWarranty(data: Warranty[]) {
    this.spinner.show();
    this.warrantyService.insertManyWarranty(data)
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
  private deleteWarranty(id: string) {
    this.spinner.show();
    this.warrantyService.deleteWarranty(id)
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
        const warranties = jsonData.warranties;
        const mData: Warranty[] = warranties.map(m => {
          const invoiceNumber = m.invoiceNumber.toString().trim();
          const customerPhoneNo = m.customerPhoneNo.toString().trim();
          const mCustomerPhoneNo = this.getModifyPhoneNo(customerPhoneNo);
          return {
            ...m,
            ...{
              invoiceNumber,
              customerPhoneNo: mCustomerPhoneNo,
              activationDate: this.excelDateToJSDate(m.activationDate)
            }
          } as Warranty;
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
    if (this.dataTypeFormat === 'json') {
      this.exportAsAJson();
    } else {
      this.exportToExcel();
    }
  }


  /**
   * EXPORTS TO EXCEL
   */
  exportToExcel() {
    this.spinner.show();
    this.warrantyService.getAllWarranty()
      .subscribe(res => {
        const allData = res.data.map(m => {
          return {
            invoiceNumber: m.invoiceNumber,
            activationDate: m.activationDate,
            warrantyPeriod: m.warrantyPeriod,
            productName: m.productName,
            sku: m.sku,
            customerName: m.customerName,
            customerPhoneNo: m.customerPhoneNo,
            totalDownload: m.totalDownload,
            lastDownload: m.lastDownload,
          } as Warranty;
        });
        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'warranties');
        XLSX.writeFile(wb, `Warranty_Backup_${date}.xlsx`);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * DOWNLOADABLE JSON
   */
  exportAsAJson() {
    this.warrantyService.getAllWarranty()
      .subscribe(res => {
        const allData = res.data as Warranty[];

        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        this.dialog.open(DownloadJsonDialogComponent, {
          maxWidth: '500px',
          data: {
            blobUrl: window.URL.createObjectURL(blob),
            backupType: 'tags'
          }
        });
      }, error => {
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
