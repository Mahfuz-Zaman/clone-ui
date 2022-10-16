import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {SubCategoryService} from '../../../services/sub-category.service';
import {ProductSubCategory} from '../../../interfaces/product-sub-category';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {EMPTY, Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductCategory} from '../../../interfaces/product-category';
import {Pagination} from '../../../interfaces/pagination';
import * as XLSX from 'xlsx';
import {DownloadJsonDialogComponent} from '../../../shared/dialog-view/download-json-dialog/download-json-dialog.component';
import {NgForm} from '@angular/forms';
import {debounceTime, distinctUntilChanged, pluck, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.component.html',
  styleUrls: ['./sub-categories.component.scss']
})
export class SubCategoriesComponent implements OnInit, AfterViewInit, OnDestroy {
  // Subscriptions
  private subAcRoute: Subscription;
  private subForm: Subscription;

  subCategories: ProductSubCategory[] = [];
  holdPrevData: ProductSubCategory[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 24;
  totalProductsStore = 0;

  // SEARCH AREA
  searchProducts: ProductSubCategory[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  // DOWNLOADABLE
  dataTypeFormat = 'json';

  constructor(
    private dialog: MatDialog,
    private subCategoryService: SubCategoryService,
    private uiService: UiService,
    private reloadService: ReloadService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshSubCategories$
      .subscribe(() => {
        this.getAllSubCategory();
      });

    // GET PAGE FROM QUERY PARAM
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllSubCategory();
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
          this.subCategories = this.holdPrevData;
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
        return this.subCategoryService.getSearchSubCategory(data, pagination);
      })
    )
      .subscribe(res => {
        this.isLoading = false;
        this.searchProducts = res.data;
        this.subCategories = this.searchProducts;
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
        this.deleteSubCategory(data);
      }
    });
  }

  public openConfirmUploadDialog(data: ProductSubCategory[]) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Import Data!',
        message: 'Warning! All the existing data will be replace'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.insertManySubCategory(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllSubCategory() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.subCategoryService.getAllSubCategory(pagination)
      .subscribe(res => {
        this.subCategories = res.data;
        this.totalProducts = res.count;
        this.holdPrevData = res.data;
        this.totalProductsStore = res.count;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  private insertManySubCategory(data: ProductSubCategory[]) {
    this.spinner.show();
    this.subCategoryService.insertManySubCategory(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshSubCategories$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  /**
   * DELETE METHOD HERE
   */
  private deleteSubCategory(id: string) {
    this.subCategoryService.deleteSubCategory(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshSubCategories$();
      }, error => {
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

        // Modify Attributes
        const allData = jsonData.subCategories;
        console.log(allData);
        const mData: ProductSubCategory[] = allData.map(m => {
          const dataNameFieldString = m.subCategoryName.toString().trim();
          return {
            ...m,
            ...{subCategorySlug: this.utilsService.transformToSlug(dataNameFieldString)},
            ...{attributes: m.attributes ? m.attributes.toString().trim().split('#') : null}
          } as ProductCategory;
        });
        this.openConfirmUploadDialog(mData);
      };
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        const attributes = JSON.parse(reader.result.toString());
        const mAttributes: ProductSubCategory[] = attributes.map(m => {
          return {
            _id: m._id ? m._id : null,
            readOnly: m.readOnly ? m.readOnly : false,
            subCategoryName: m.subCategoryName,
            subCategorySlug: m.subCategorySlug,
            brand: m.brand,
            category: m.category,
            attributes: m.attributes,
          } as ProductSubCategory;
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
    this.subCategoryService.getAllSubCategory()
      .subscribe(res => {
        const allData = res.data as ProductSubCategory[];
        const mData = allData.map(m => {
          return {
            ...m,
            // @ts-ignore
            category: m.category._id,
            attributes: m.attributes && m.attributes?.length > 0 ? this.utilsService.arrayToString(m.attributes.map(m2 => m2._id), '#') : null
          };
        });

        const date = this.utilsService.getDateString(new Date());
        // EXPORT XLSX
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'subCategories');
        XLSX.writeFile(wb, `Sub_Categories_Backup_${date}.xlsx`);
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
    this.subCategoryService.getAllSubCategory()
      .subscribe(res => {
        const allData = res.data as ProductSubCategory[];

        const blob = new Blob([JSON.stringify(allData, null, 2)], {type: 'application/json'});
        this.dialog.open(DownloadJsonDialogComponent, {
          maxWidth: '500px',
          data: {
            blobUrl: window.URL.createObjectURL(blob),
            backupType: 'subcategories'
          }
        });
      }, error => {
        console.log(error);
      });

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
