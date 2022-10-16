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
import {CertificateVerificationService} from '../../../services/certificate-verification.service';
import {CertificateVerification} from '../../../interfaces/certificate-verification';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {MatSelect, MatSelectChange} from '@angular/material/select';
@Component({
  selector: 'app-certificate-verification',
  templateUrl: './certificate-verification.component.html',
  styleUrls: ['./certificate-verification.component.scss']
})
export class CertificateVerificationComponent implements OnInit, OnDestroy{
  // Subscriptions
  private subAcRoute: Subscription;
  private subReloadServices: Subscription;
  private subForm: Subscription;

  certificates: CertificateVerification[] = [];
  holdPrevData: CertificateVerification[] = [];

  // DOWNLOADABLE
  dataTypeFormat = 'excel';

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 10;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: CertificateVerification[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;


  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  constructor(
    private dialog: MatDialog,
    private certificateVerificationService: CertificateVerificationService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }


  ngOnInit(): void {
    this.subReloadServices = this.reloadService.refresCertificateVerificationList$
      .subscribe(() => {
        this.getAllCertificates();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllCertificates();
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
          this.certificates = this.holdPrevData;
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
        return this.certificateVerificationService.getSearchCertificate(data, pagination);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.certificates = this.searchProducts;
        this.totalProducts = res.count;
        this.currentPage = 1;
        this.router.navigate([], {queryParams: {page: this.currentPage}});
      }, error => {
        this.isLoading = false;
      });
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
        // console.log('jsonData', jsonData);
        const certificates = jsonData.users;
        const mData: CertificateVerification[] = certificates.map(m => {
          const certificateNumber = m.certificateNumber.toString().trim();
          const phoneNo = m.phoneNo.toString().trim();
          const mCustomerPhoneNo = this.getModifyPhoneNo(phoneNo);
          return {
            ...m,
            ...{
              certificateNumber,
              customerPhoneNo: mCustomerPhoneNo,
              validity: this.excelDateToJSDate(m.validity)
            }
          } as CertificateVerification;
        });
        // console.log(mData);
        this.openConfirmUploadDialog(mData);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const warranties = JSON.parse(reader.result.toString());
        const mData: CertificateVerification[] = warranties.map(m => {
          const invoiceNumber = m.invoiceNumber.toString().trim();
          return {
            ...m,
            ...{
              invoiceNumber,
              activationDate: this.excelDateToJSDate(m.activationDate)
            }
          } as CertificateVerification;
        });
        this.openConfirmUploadDialog(mData);
      };
      reader.onerror = (error) => {
        console.log(error);
      };
    }
  }

  /**
   * ON Select Check
   */

   onCheckChange(event: any, index: number, id: string) {
    if (event) {
      this.selectedIds.push(id);
    } else {
      const i = this.selectedIds.findIndex(f => f === id);
      this.selectedIds.splice(i, 1);
    }
  }

  onAllSelectChange(event: MatCheckboxChange) {
    const currentPageIds = this.certificates.map(m => m._id);
    if (event.checked) {
      this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds);
      this.certificates.forEach(m => {
        m.select = true;
      });
    } else {
      currentPageIds.forEach(m => {
        this.certificates.find(f => f._id === m).select = false;
        const i = this.selectedIds.findIndex(f => f === m);
        this.selectedIds.splice(i, 1);
      });
    }
  }


  /**
   * PAGINATION CHANGE
   */
   public onPageChanged(event: any) {
    this.router.navigate([], {queryParams: {page: event}});
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
        this.deleteCertificate(data);
      }
    });
  }
  public openConfirmUploadDialog(data: CertificateVerification[]) {
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
  exportDataToFile() {
    if (this.dataTypeFormat === 'json') {
      this.exportAsAJson();
    } else {
      this.exportToExcel();
    }
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
   * EXPORTS TO EXCEL
   */
     exportToExcel() {
      this.spinner.show();

      if(this.selectedIds && this.selectedIds.length > 0 ){
        this.certificateVerificationService.getMultipleCertificatesByAdmin(this.selectedIds)
        .subscribe(res => {
          const allData = res.data.map(m => {
            return {
              // refNumber: m.refNumber,
              certificateNumber: m.certificateNumber,
              storeName: m.storeName,
              dealerName: m.dealerName,
              address: m.address,
              phoneNo: m.phoneNo,
              validity: m.validity,
            } as CertificateVerification;
          });
          const date = this.utilsService.getDateString(new Date());
          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'users');
          XLSX.writeFile(wb, `users.xlsx`);
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          console.log(error);
        });
      }
      else{
      this.certificateVerificationService.getAllCertificatesByAdminNoPaginate()
        .subscribe(res => {
          const allData = res.data.map(m => {
            return {
              // refNumber: m.refNumber,
              certificateNumber: m.certificateNumber,
              storeName: m.storeName,
              dealerName: m.dealerName,
              address: m.address,
              phoneNo: m.phoneNo,
              validity: m.validity,
            } as CertificateVerification;
          });
          const date = this.utilsService.getDateString(new Date());
          // EXPORT XLSX
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(allData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'users');
          XLSX.writeFile(wb, `users.xlsx`);
          this.spinner.hide();
        }, error => {
             this.spinner.hide();
             console.log(error);
           });
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
   * DOWNLOADABLE JSON
   */
   exportAsAJson() {
    this.certificateVerificationService.getAllCertificates()
      .subscribe(res => {
        const allData = res.data as CertificateVerification[];

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
   * HTTP REQ HANDLE
   */

   private getAllCertificates() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };
    this.certificateVerificationService.getAllCertificates(pagination)
      .subscribe(res => {
        this.certificates = res.data;
        this.totalProducts = res.count;
        this.holdPrevData = res.data;
        this.totalProductsStore = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private insertManyWarranty(data: CertificateVerification[]) {
    this.spinner.show();
    this.certificateVerificationService.insertManyCertificate(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCerificateVerificationList$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  /**
   * DELETE METHOD HERE
   */
   private deleteCertificate(id: string) {
    this.spinner.show();
    this.certificateVerificationService.deleteCertificate(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCerificateVerificationList$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * ON DESTROY
   */
   ngOnDestroy() {
    if (this.subAcRoute) {
      this.subAcRoute.unsubscribe();
    }
    if (this.subReloadServices) {
      this.subReloadServices.unsubscribe();
    }
    if (this.subForm) {
      this.subForm.unsubscribe();
    }
  }

}
