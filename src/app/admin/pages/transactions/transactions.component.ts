import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {OrderStatus} from '../../../enum/order-status';
import {Order} from '../../../interfaces/order';
import {OrderService} from '../../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pagination} from '../../../interfaces/pagination';
import * as xlsx from 'xlsx';
import {UtilsService} from '../../../services/utils.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  private subAcRoute: Subscription;

  public orderEnum = OrderStatus;

  transactions: Order[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  // Data Table Ref
  @ViewChild('dataTable') dataTable?: ElementRef;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getAllTransactionByAdmin();
    });
  }

  private getAllTransactionByAdmin() {
    this.spinner.show();
    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllTransactionByAdmin(pagination)
      .subscribe(res => {
        this.transactions = res.data;
        this.totalProducts = res.count;
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
   * EXPORTS TO EXCEL
   */
  exportToExcel() {
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(this.dataTable?.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    const date = this.utilsService.getDateString(new Date());
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, `${'Transaction'}_${date}.xlsx`);
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
