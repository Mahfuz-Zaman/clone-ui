import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../interfaces/order';
import {OrderStatus} from '../../../../enum/order-status';
import {ActivatedRoute, Router} from '@angular/router';
import {OrderService} from '../../../../services/order.service';
import {UiService} from '../../../../services/ui.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  orderId: string = null;
  order: Order = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.orderId = param.get('id');
      this.getOrderDetails();
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getOrderDetails() {
    this.orderService.getOrderDetails(this.orderId)
      .subscribe(res => {
        this.order = res.data;
        console.log('My order details',this.order);
      }, error => {
        console.log(error);
      });
  }

}
