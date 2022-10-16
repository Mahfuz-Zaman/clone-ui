import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrderStatus} from '../../../../enum/order-status';
import {Order} from '../../../../interfaces/order';
import {OrderService} from '../../../../services/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Pagination} from '../../../../interfaces/pagination';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {

  private subAcRoute: Subscription;

  public orderEnum = OrderStatus;

  userOrder: Order[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 5;
  totalProductsStore = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.subAcRoute = this.activatedRoute.queryParams.subscribe(qParam => {
      if (qParam && qParam.page) {
        this.currentPage = qParam.page;
      } else {
        this.currentPage = 1;
      }
      this.getOrderListByUser();
    });
  }

  private getOrderListByUser() {
    this.spinner.show();

    const pagination: Pagination = {
      pageSize: this.productsPerPage.toString(),
      currentPage: this.currentPage.toString()
    };

    this.orderService.getAllOrdersByUser(pagination)
      .subscribe(res => {
        this.userOrder = res.data;
        // console.log(res.count);
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
