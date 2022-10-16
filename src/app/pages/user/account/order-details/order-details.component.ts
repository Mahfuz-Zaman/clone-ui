import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../interfaces/order';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../../services/order.service';
import {UiService} from '../../../../services/ui.service';
import {OrderStatus} from '../../../../enum/order-status';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderId: string = null;
  order: Order = null;
  orderStatusEnum = OrderStatus.PENDING;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private uiService: UiService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.orderId = param.get('id');
      this.getOrderDetails();
    });
  }

  updatedAmount() {
    let refundAmount = 0;
    this.order.orderedItems.map( item => {
      if (!item.product && item.deleteDeliveryStatus === 'not-shipped-or-delivered') {
        refundAmount += item.price * item.quantity;
      }
    });
    this.order.refundAmount = refundAmount;
  }

  /**
   * HTTP REQ HANDLE
   */

  private getOrderDetails() {
    this.orderService.getOrderDetails(this.orderId)
      .subscribe(res => {
        this.order = res.data;
        this.updatedAmount();
      }, error => {
        console.log(error);
      });
  }


  cancelOrderByUser() {
    this.orderService.cancelOrderByUser(this.orderId)
      .subscribe(res => {
        if (res.status === 1) {
          this.uiService.success(res.message);
        } else {
          this.uiService.warn(res.message);
        }
        this.router.navigate(['/account/order-list']);
      }, error => {
        console.log(error);
      });
  }




}
