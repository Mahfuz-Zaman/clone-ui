import {Component, Input, OnInit} from '@angular/core';
import {DealsOfTheDay} from '../../../interfaces/deals-of-the-day';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {UserService} from '../../../services/user.service';
import {CartService} from '../../../services/cart.service';
import {ReloadService} from '../../../services/reload.service';
import {UiService} from '../../../services/ui.service';
import {Cart} from '../../../interfaces/cart';
import {Product} from '../../../interfaces/product';
import { CarouselCtrService } from 'src/app/services/carousel-ctr.service';


@Component({
  selector: 'app-deal-of-day-card',
  templateUrl: './deal-of-day-card.component.html',
  styleUrls: ['./deal-of-day-card.component.scss']
})
export class DealOfDayCardComponent implements OnInit {

  @Input() data: DealsOfTheDay;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private userService: UserService,
    private cartService: CartService,
    private reloadService: ReloadService,
    private uiService: UiService,
    public carouselCtrService: CarouselCtrService
  ) {
  }

  ngOnInit(): void {
  }

  /**
   * CLICK With Event
   */

  addToCart(event: MouseEvent) {
    // event.stopPropagation();
    const product = this.data?.product as Product;
    const data: Cart = {
      product: product._id,
      selectedQty: 1,
    };


    if (this.userService.getUserStatus()) {
      this.addItemToCartDB(data);
    } else {
      this.cartService.addCartItemToLocalStorage(data);
      this.reloadService.needRefreshCart$();
    }
  }


  /**
   * HTTP REQ HANDLE
   */

  addItemToCartDB(data: Cart) {
    this.cartService.addItemToUserCart(data)
      .subscribe(res => {
        // console.log(res);
        this.uiService.success(res.message);
        this.reloadService.needRefreshCart$();
      }, error => {
        console.log(error);
      });
  }


  onNavigate(url?: string) {
    const product = this.data?.product as Product;
    this.router.navigate(['/', product?.brandSlug, product?.categorySlug, product?.productSlug]);
  }

}
