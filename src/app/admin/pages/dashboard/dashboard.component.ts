import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import {DataService} from '../../../services/data.service';
import {AdminService} from '../../../services/admin.service';
import {StoredDataService} from '../../../services/stored-data.service';
import {EMPTY, Subscription} from 'rxjs';
import {OrderStatus} from '../../../enum/order-status';
import {Order, OrderItem} from '../../../interfaces/order';
import {FormControl, FormGroup, NgForm} from '@angular/forms';
import {OrderService} from '../../../services/order.service';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {MatCheckbox, MatCheckboxChange} from '@angular/material/checkbox';
import {UtilsService} from '../../../services/utils.service';
import {OrderStatusPipe} from '../../../shared/pipes/order-status.pipe';
import {ReloadService} from '../../../services/reload.service';
import {Pagination} from '../../../interfaces/pagination';
import {UpdateOrderStatusComponent} from '../orders/update-order-status/update-order-status.component';
import {MatSelect, MatSelectChange} from '@angular/material/select';

export interface OrderFilter {
  deliveryStatus?: number;
  checkoutDate?: any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [OrderStatusPipe]
})
export class DashboardComponent implements OnInit {


  private subAcRoute: Subscription;

  public orderEnum = OrderStatus;

  // Selected Data
  selectedIds: string[] = [];
  @ViewChild('matCheckbox') matCheckbox: MatCheckbox;

  // Store Data
  orders: Order[] = [];
  private holdPrevData: Order[] = [];

  private subForm: Subscription;

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 15;
  totalProductsStore = 0;

  orderStatus: any[] = [
    {value: null, viewValue: 'None'},
    {value: OrderStatus.PENDING, viewValue: 'Pending'},
    {value: OrderStatus.CONFIRM, viewValue: 'Confirm'},
    {value: OrderStatus.PROCESSING, viewValue: 'Processing'},
    {value: OrderStatus.SHIPPING, viewValue: 'Shipping'},
    {value: OrderStatus.DELIVERED, viewValue: 'Delivered'},
    {value: OrderStatus.CANCEL, viewValue: 'Cancel'},
    {value: OrderStatus.REFUND, viewValue: 'Refund'},
  ];

  // Filter Date Range
  startDate?: string;
  endDate?: string;

  // Form Group
  dataFormRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // Data Filtering
  isFiltering = false;

  // Max & Min Data
  today = new Date();
  // QUERY
  filterQuery: OrderFilter = null;

  // SEARCH AREA
  searchProducts: Order[] = [];
  isLoading = false;
  isSelect = false;
  searchQuery = null;
  @ViewChild('searchForm') searchForm: NgForm;
  @ViewChild('searchInput') searchInput: ElementRef;

  @ViewChild('matSelectFilter') matSelectFilter: MatSelect;

  // DOWNLOADABLE
  dataTypeFormat = 'excel';

  constructor(
    private dialog: MatDialog,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataService: DataService,
    private adminService: AdminService,
    private storedDataService: StoredDataService,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService,
    private orderStatusPipe: OrderStatusPipe,
    private reloadService: ReloadService,
  ) {
  }

  ngOnInit() {
    this.reloadService.refreshOrder$
      .subscribe(() => {
        this.getPendingOrdersByAdmin();
      });

    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      if (!this.searchProducts.length) {
        this.getPendingOrdersByAdmin();
      }
    });
    this.getUserData();
    // this.countsCollectionsDocuments();
  }


  /**
   * HTTP REQ HANDLE
   */

  // private countsCollectionsDocuments() {
  //   this.dataService.countsCollectionsDocuments()
  //     .subscribe(res => {
  //       this.counts = res.data;
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  /**
   * HTTP Requested Data
   */
  private getUserData() {
    this.adminService.getAdminShortData()
      .subscribe(res => {
      });
  }

  private getPendingOrdersByAdmin() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getPendingOrdersByAdmin(pagination,null)
    // this.orderService.getAllOrdersByAdmin( null, this.filterQuery)
      .subscribe(res => {
        this.spinner.hide();
        // console.log(res.data);
        this.orders = res.data;

        if (this.orders && this.orders.length) {
          this.orders.forEach((m, i) => {
            const index = this.selectedIds.findIndex(f => f === m._id);
            this.orders[i].select = index !== -1;
          });
        }

        this.holdPrevData = res.data;
        this.totalProducts = res.count;
        this.totalProductsStore = res.count;

        // this.checkSelectionData();

      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  // private checkSelectionData() {
  //   let isAllSelect = true;
  //   this.orders.forEach(m => {
  //     if (!m.select) {
  //       isAllSelect = false;
  //     }
  //   });

  //   this.matCheckbox.checked = isAllSelect;
  // }

  /**
   * OPEN COMPONENT DIALOG
   */

  //  public openUpdateStatusOrderDialog() {

  //   this.orderService.getMultipleOrderByAdmin(this.selectedIds)
  //     .subscribe(res => {
  //       const allData = res.data as Order[];
  //       const mData = this.getMData(allData);
  //       const date = this.utilsService.getDateString(new Date())

  //       const dialogRef = this.dialog.open(UpdateCheckboxOrderStatusComponent, {
  //         data: mData,
  //         panelClass: ['theme-dialog'],
  //         // width: '100%',
  //         // minHeight: '60%',
  //         autoFocus: false,
  //         disableClose: false
  //       });

  //       dialogRef.afterClosed().subscribe(dialogResult => {
  //         if (dialogResult) {

  //         }
  //       });


  //       this.spinner.hide();
  //     }, error => {
  //       this.spinner.hide();
  //       console.log(error);
  //     });

  // }



  /**
   * OPEN COMPONENT DIALOG
   */

   public openUpdateOrderDialog(order?: Order) {
    const dialogRef = this.dialog.open(UpdateOrderStatusComponent, {
      data: order,
      panelClass: ['theme-dialog'],
      // width: '100%',
      // minHeight: '60%',
      autoFocus: false,
      disableClose: false
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

      }
    });
  }


  /**
   * get data from getMultipleOrderByAdmin
   */

   getMData(allData){
    return allData.map(m => {
       return {
         _id: m._id,
         orderId: m.orderId,
         checkoutDate: this.utilsService.getDateString(m.checkoutDate),
         // deliveryDate: m.deliveryDate ? this.utilsService.getDateString(m.deliveryDate) : 'N/A',
         deliveryStatus: this.orderStatusPipe.transform(m.deliveryStatus),
         subTotal: m.subTotal,
         discount: m.discount,
         shippingFee: m.shippingFee,
         totalAmount: m.totalAmount,
         totalAmountWithDiscount: m.totalAmountWithDiscount,
         paymentStatus: m.paymentStatus,
         paymentMethod: m.paymentStatus,
         name: m.name,
         phoneNo: m.phoneNo,
         email: m.email,
         alternativePhoneNo: m.alternativePhoneNo ? m.alternativePhoneNo : 'N/A',
         city: m.city ? m.city : 'N/A',
         area: m.area ? m.area : 'N/A',
         postCode: m.postCode ? m.postCode : 'N/A',
         shippingAddress: m.shippingAddress,
         couponId: m.couponId,
         couponValue: m.couponValue,
         orderNotes: m.orderNotes,
         nextPhaseDate: this.utilsService.getDateString(new Date()),
         products: this.getProductInfoAsString(m.orderedItems)
       };
     });
   }

  // onAllSelectChange(event: MatCheckboxChange) {
  //   const currentPageIds = this.orders.map(m => m._id);
  //   if (event.checked) {
  //     this.selectedIds = this.utilsService.mergeArrayString(this.selectedIds, currentPageIds);
  //     this.orders.forEach(m => {
  //       m.select = true;
  //     });
  //   } else {
  //     currentPageIds.forEach(m => {
  //       this.orders.find(f => f._id === m).select = false;
  //       const i = this.selectedIds.findIndex(f => f === m);
  //       this.selectedIds.splice(i, 1);
  //     });
  //   }
  // }
  /**
   * PAGINATION CHANGE
   */
   public onPageChanged(event: any) {
    // this.router.navigate([], {queryParams: {page: event}});
  }

  /**
   * EXPORTS TO EXCEL
   */
   private getProductInfoAsString(items: OrderItem[]) {
    const itemsStrArr = items.map(m => {
      if (m.product) {
        // @ts-ignore
        return `${m.product.productName} - ${this.utilsService.slugToNormal(m.product.categorySlug)} - ${this.utilsService.slugToNormal(m.product.subCategorySlug)} - ${this.utilsService.slugToNormal(m.product.brandSlug)} (QTY #${m.quantity})`;

      } else {
        return `N/A`;
      }
    });
    return itemsStrArr.join();
  }
 /**
   * NG CLASS
   */
  getDeliveryStatusColor(order: Order) {
    switch (order.deliveryStatus) {

      case this.orderEnum.CANCEL: {
        return 'cancel';
      }
      case this.orderEnum.PROCESSING: {
        return 'processing';
      }
      case this.orderEnum.CONFIRM: {
        return 'confirm';
      }
      case this.orderEnum.DELIVERED: {
        return 'delivered';
      }
      case this.orderEnum.REFUND: {
        return 'refund';
      }
      case this.orderEnum.SHIPPING: {
        return 'shipping';
      }
      default: {
        return 'none';
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
  }
}
