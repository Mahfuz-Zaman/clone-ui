import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {ProductAttribute} from '../../../interfaces/product-attribute';
import {AttributeService} from '../../../services/attribute.service';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {NgxSpinnerService} from 'ngx-spinner';
import * as XLSX from 'xlsx';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {EMPTY, Subscription} from 'rxjs';
import {Pagination} from '../../../interfaces/pagination';
import {DownloadJsonDialogComponent} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.component';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';


@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.scss']
})
export class AttributesComponent implements OnInit, AfterViewInit, OnDestroy {

  // Subscriptions
  private subAcRoute: Subscription;
  private subForm: Subscription;

  attributes: ProductAttribute[] = [];
  holdPrevData: ProductAttribute[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: ProductAttribute[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // DOWNLOADABLE
  dataTypeFormat = 'json';

  constructor(
    private dialog: MatDialog,
    private attributeService: AttributeService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshAttributes$
      .subscribe(() => {
        this.getAllAttributes();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllAttributes();
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
          this.attributes = this.holdPrevData;
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
        return this.attributeService.getSearchAttribute(data, pagination);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.attributes = this.searchProducts;
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
        this.deleteAttribute(data);
      }
    });
  }

  public openConfirmUploadDialog(data: ProductAttribute[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManyAttribute(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllAttributes() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.attributeService.getAllAttributes(pagination)
      .subscribe(res => {
        this.attributes = res.data;
        this.totalProducts = res.count;
        this.holdPrevData = res.data;
        this.totalProductsStore = res.count;
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private insertManyAttribute(data: ProductAttribute[]) {
    this.spinner.show();
    this.attributeService.insertManyAttribute(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAttributes$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  /**
   * DELETE METHOD HERE
   */
  private deleteAttribute(id: string) {
    this.spinner.show();
    this.attributeService.deleteAttribute(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAttributes$();
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
   * IMPORT JSON DATA
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
        const attributes = jsonData.attributes;
        const mAttributes: ProductAttribute[] = attributes.map(m => {
          const attributeValueString = m.attributeValues.toString().trim();
          const attributeNameString = m.attributeName.toString().trim();
          return {
            ...m,
            ...{attributeSlug: this.utilsService.transformToSlug(attributeNameString)},
            ...{attributeValues: attributeValueString.split('#')}
          } as ProductAttribute;
        });
        this.openConfirmUploadDialog(mAttributes);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const attributes = JSON.parse(reader.result.toString());
        const mAttributes: ProductAttribute[] = attributes.map(m => {
          return {
            _id: m._id ? m._id : null,
            attributeName: m.attributeName,
            attributeSlug: m.attributeSlug,
            attributeValues: m.attributeValues,
          } as ProductAttribute;
        });
        this.openConfirmUploadDialog(mAttributes);
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
    this.attributeService.getAllAttributes()
      .subscribe(res => {
        const allData = res.data as ProductAttribute[];
        const mData = allData.map(m => {
          return {
            ...m,
            attributeValues: this.utilsService.arrayToString(m.attributeValues, '#')
          };
        });
        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'attributes');
        XLSX.writeFile(wb, `Attributes_Backup_${date}.xlsx`);
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
    this.attributeService.getAllAttributes()
      .subscribe(res => {
        const allData = res.data as ProductAttribute[];

        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        this.dialog.open(DownloadJsonDialogComponent, {
          maxWidth: '500px',
          data: {
            blobUrl: window.URL.createObjectURL(blob),
            backupType: 'attributes'
          }
        });
      }, error => {
        console.log(error);
      });

  }

  //
  // generateDownloadJsonUri() {
  //   var theJSON = JSON.stringify(this.resJsonResponse);
  //   var uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
  //   this.downloadJsonHref = uri;
  // }


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
