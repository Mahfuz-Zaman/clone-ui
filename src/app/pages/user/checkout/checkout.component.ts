import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { Address } from '../../../interfaces/address';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from '../../../services/user-data.service';
import { ReloadService } from '../../../services/reload.service';
import { Cart } from '../../../interfaces/cart';
import { UiService } from '../../../services/ui.service';
import { CartService } from '../../../services/cart.service';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { Product } from '../../../interfaces/product';
import { Order, OrderItem } from '../../../interfaces/order';
import { UtilsService } from '../../../services/utils.service';
import { OrderStatus } from '../../../enum/order-status';
import { SslInit } from '../../../interfaces/ssl-init';
import { OrderService } from '../../../services/order.service';
import { PaymentSslService } from '../../../services/payment-ssl.service';
import { SslInitResponse } from '../../../interfaces/ssl-init-response';
import { ConfirmOrderDialogComponent } from './confirm-order-dialog/confirm-order-dialog.component';
import { Select } from '../../../interfaces/select';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { User } from '../../../interfaces/user';
import { ConfirmDialogComponent } from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import { ShippingCharge } from '../../../interfaces/shippingcharge';
import { StorageService } from '../../../services/storage.service';
import { CouponService } from '../../../services/coupon.service';
import { ShippingChargeService } from '../../../services/shipping-charge';
import { Coupon } from '../../../interfaces/coupon';
import { BulkSmsService } from 'src/app/services/bulk-sms.service';
import { BulkSms } from '../../../interfaces/bulk-sms';
import { AddNewAddressComponent } from '../../../shared/dialog-view/add-new-address/add-new-address.component';
import { CouponType } from '../../../enum/coupon-type';
import { CouponDiscountType } from '../../../enum/coupon-discount-type';
import { UserService } from '../../../services/user.service';
import {Setting} from '../../../interfaces/setting';
import {SettingService} from '../../../services/setting.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [PricePipe]
})
export class CheckoutComponent implements OnInit, OnDestroy {

  // Address
  userAddress: Address[] = [];
  selectedAddressIndex = 0;

  // CARTS
  carts: Cart[] = [];

  shippingChargeData: ShippingCharge = null;
  shippingCharge = 0;

  // NOTES
  orderNotes = '';

  // TERMS
  isAccept = false;

  // Store Order Data
  order: Order = null;

  // PAYMENT DATA
  currency = 'BDT';
  shippingMethod: 'Courier';
  shippingType = 'Courier';
  productsNameStr: string = null;
  productsCatStr: string = null;

  // PAYMENT TYPES
  paymentTypes: Select[] = [];

  // paymentTypes: Select[] = [
  //   {value: 'cash_on_delivery', viewValue: 'Cash on Delivery'},
  //   {value: 'online_payment', viewValue: 'Online Payment or Bkash, Nagad or Rocket' },
  // ];

  selectedPaymentType = 'online_payment';

  user: User = null;

  // Coupon
  couponText: string;
  couponData: Coupon = null;
  finalDiscount = 0;

  // Counter
  expireCountDown = 0;
  timeInstanceExpire = null;
  setting: Setting;



  constructor(
    private dialog: MatDialog,
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private uiService: UiService,
    private cartService: CartService,
    private pricePipe: PricePipe,
    private utilsService: UtilsService,
    private orderService: OrderService,
    private storageService: StorageService,
    private couponService: CouponService,
    private paymentSslService: PaymentSslService,
    private shippingService: ShippingChargeService,
    private router: Router,
    private bulkSmsService: BulkSmsService,
    private userService: UserService,
    private settingService: SettingService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {

    this.reloadService.refreshAddress$.subscribe(() => {
      this.getUserAddress();
    });

    // GET DATA
    this.getLoggedInUserInfo();
    this.getUserAddress();
    this.getCartItemList();

    this.couponData = this.storageService.storedCouponData;
    if (this.couponData) {
      this.couponText = this.couponData.couponCode;
      this.getCouponCalculation();
    }

    // Session
    this.countSessionExpireTime(1200);
    // this.checkCouponData();

    this.getSettingInfo();
  }

  checkCouponData() {
    // this.couponData = this.storageService.storedCouponData;
    // if (this.couponData) {
    //   this.couponService.getCouponCouponId(this.couponData._id)
    //     .subscribe(res => {
    //       // @ts-ignore
    //       this.couponData = res.data;
    //       if (this.couponData.couponUsedByUser.includes(this.user._id)) {
    //         this.couponData = null;
    //         this.uiService.warn('Coupon is not applicable anymore, and has been removed');
    //       }
    //     }, err => {
    //       console.log(err);
    //     });
    // }

  }

  onChangeAddress(event: MatRadioChange) {
    this.selectedAddressIndex = event.value;
    if (this.userAddress[event.value].city === 'Dhaka') {
      this.shippingCharge = this.shippingChargeData?.deliveryInDhaka;
    } else {
      this.shippingCharge = this.shippingChargeData?.deliveryOutsideDhaka;
    }
  }

  /**
   * APPLY COUPON
   */

  applyCoupon() {
    if (!this.userService.getUserStatus()) {
      this.uiService.warn('Please log in for apply this coupon');
      return;
    }
    if (!this.couponText) {
      this.uiService.warn('No Coupon text');
      return;
    } else {
      this.checkCoupon();
    }
  }

  removeCoupon() {
    this.couponData = null;
    this.couponText = null;
    this.finalDiscount = 0;
    this.storageService.storeCouponData(this.couponData);
  }

  /**
   * COMPONENT DIALOG VIEW
   */

  openAddNewAddressDialog(address?: Address) {
    this.dialog.open(AddNewAddressComponent, {
      data: address,
      panelClass: ['theme-dialog'],
      maxHeight: '600px',
      autoFocus: false,
      disableClose: false
    });
  }

  openConfirmOrderDialog() {
    const dialogRef = this.dialog.open(ConfirmOrderDialogComponent, {
      data: {
        order: this.order,
        carts: this.carts,
        selectedPaymentType: this.selectedPaymentType
      },
      panelClass: ['theme-dialog'],
      width: '90%',
      maxWidth: '1050px',
      autoFocus: false,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.isConfirm) {
          if (this.selectedPaymentType === 'cash_on_delivery') {
            this.saveOrderInformationToMain();
            // this.saveOrderInformationToTemp();
          } else if (this.order.totalAmountWithDiscount < 10) {
            this.order.paymentMethod = 'cash_on_delivery';
            if (this.order.totalAmountWithDiscount === 0) {
              this.order.paymentStatus = 'paid';
            }
            this.saveOrderInformationToMain();
          } else {
            this.saveOrderInformationToTemp();
          }
        }
      }
    });
  }


  public openConfirmDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this address?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteUserAddress(id);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   * LOCAL STORAGE HANDLE
   */

  private getLoggedInUserInfo() {
    const select = '-password';
    this.userDataService.getLoggedInUserInfo(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getUserAddress() {
    this.userDataService.getAllAddress()
      .subscribe((res1) => {
        this.userAddress = res1.data;

        this.shippingService.getExtraPriceInfo()
          .subscribe(res => {
            this.shippingChargeData = res.data;
            if (this.shippingChargeData) {
              this.shippingCharge = this.shippingChargeData.deliveryInDhaka;
              if (this.userAddress && this.userAddress.length > 0) {
                this.shippingCharge = this.userAddress[0].city === 'Dhaka' ? this.shippingChargeData.deliveryInDhaka : this.shippingChargeData.deliveryOutsideDhaka;
              } else {
                this.shippingCharge = this.shippingChargeData.deliveryInDhaka;
              }
            }
          }, error => {
            console.log(error);
          });

      }, err => {
        console.log(err);
      });
  }

  private deleteUserAddress(id: string) {
    this.userDataService.deleteAddress(id)
      .subscribe((res) => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAddress$();
      }, err => {
        console.log(err);
      });
  }


  private getCartItemList() {
    this.cartService.getCartItemList()
      .subscribe(res => {
        this.carts = res.data;
        if (this.carts && this.carts.length > 0) {
          const productNames = this.carts.map(m => {
            const product = m.product as Product;
            return product.productName;
          });
          const productCategories = this.carts.map(m => {
            const product = m.product as Product;
            return product.categorySlug;
          });
          this.productsNameStr = productNames.join();
          this.productsCatStr = productCategories.join();
        } else {
          this.router.navigate(['/']);
        }

      }, error => {
        console.log(error);
      });
  }

  private saveOrderInformationToMain() {
    this.orderService.placeOrder(this.order)
      .subscribe(res => {
        this.couponData = null;
        this.couponText = null;
        this.storageService.storeCouponData(this.couponData);
        // Create Message Data
        const finalPhoneNo = '88' + this.order.phoneNo;
        const message = `Dear ${this.order.name}, Your order ${res.orderId} has been placed. We will update you once the order is confirmed. Thank you for shopping at www.softlabit.com.`;
        this.sendSmsBySslAPi(finalPhoneNo, message, finalPhoneNo);
        this.uiService.success(res.message);
        this.router.navigate(['/account/order-list']);

      }, error => {
        console.log(error);
      });
  }

  private saveOrderInformationToTemp() {
    this.orderService.placeTempOrder(this.order)
      .subscribe(res => {
        this.couponData = null;
        this.couponText = null;
        this.storageService.storeCouponData(this.couponData);
        if (res.success) {
          this.sslInitWithOrder(res.orderId, res._id);
        } else {
          this.uiService.wrong(res.message);
        }
      }, error => {
        console.log(error);
      });

  }

  private checkCoupon() {
    this.couponService.checkCouponForApply(this.couponText)
      .subscribe(res => {
        if (res.success) {
          if (this.cartSubTotal < res.data.couponMinPurchase) {
            this.uiService.warn('The minimum Amount for apply this coupon is ' + res.data.couponMinPurchase);
          } else {
            this.couponData = res.data;
            this.storageService.storeCouponData(this.couponData);
            this.getCouponCalculation();
            this.uiService.success(res.message);
          }

        } else {
          this.uiService.warn(res.message);
        }
      }, error => {
        console.log(error);
      });
  }


  /**
   * CALCULATION
   */
  getCouponCalculation() {

    if (this.couponData.couponType === CouponType.AMOUNT) {

      if (this.couponData.couponDiscountType === CouponDiscountType.ORDERDISCOUNT) {
        this.finalDiscount = this.couponData.couponAmount;
      } else if (this.couponData.couponDiscountType === CouponDiscountType.SHIPPINGDISCOUNT) {
        this.finalDiscount = (this.shippingChargeData && this.shippingChargeData.deliveryInDhaka ? this.shippingChargeData.deliveryInDhaka : 0);
      } else {
        this.finalDiscount = this.couponData.couponAmount;
      }
    } else {
      if (this.couponData.couponDiscountType === CouponDiscountType.ORDERDISCOUNT) {
        this.finalDiscount = Math.floor(this.cartSubTotal * (this.couponData.couponAmount / 100));
      } else if (this.couponData.couponDiscountType === CouponDiscountType.SHIPPINGDISCOUNT) {
        this.finalDiscount = (this.shippingChargeData && this.shippingChargeData.deliveryInDhaka ? this.shippingChargeData.deliveryInDhaka : 0);
      } else {
        this.finalDiscount = (this.cartSubTotal + (this.shippingChargeData && this.shippingChargeData.deliveryInDhaka ? this.shippingChargeData.deliveryInDhaka : 0)) * (this.couponData.couponAmount / 100);
      }
    }

  }

  get cartSubTotal(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'priceWithDiscount', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }

  get cartTotalDiscount(): number {
    return this.carts.map(t => {
      return this.pricePipe.transform(t.product as Product, 'discountPrice', t.selectedQty) as number;
    }).reduce((acc, value) => acc + value, 0);
  }


  /**
   * MAIN PLACE ORDER
   */
  placeOrder() {
    // if (this.couponData) {
    //   this.couponService.getCouponCouponId(this.couponData._id)
    //     .subscribe(res => {
    //       // @ts-ignore
    //       this.couponData = res.data;
    //       if (this.couponData.couponUsedByUser.includes(this.user._id)) {
    //         // Re-do calculation
    //
    //         this.couponData = null;
    //         this.uiService.warn('Coupon is not applicable anymore, and has been removed');
    //       } else {
    //         // tslint:disable-next-line:no-unused-expression
    //         this.couponCalculation;
    //       }
    //     }, err => {
    //       console.log(err);
    //     });
    // }

    if (this.userAddress.length <= 0) {
      this.uiService.warn('Please select correct shipping address');
      return;
    }

    if (!this.isAccept) {
      this.uiService.warn('Please accept our terms and conditions con continue');
      return;
    }

    const products = this.carts.map(m => {
      const product = m.product as Product;
      return {
        product: product._id,
        price: this.pricePipe.transform(product as Product, 'priceWithDiscount') as number,
        discountType: product.discountType,
        discountAmount: product.discountAmount,
        quantity: m.selectedQty,
        orderType: 'regular',
      } as OrderItem;
    });

    this.order = {
      paymentMethod: this.selectedPaymentType,
      checkoutDate: new Date(),
      name: this.userAddress[this.selectedAddressIndex].name,
      phoneNo: this.userAddress[this.selectedAddressIndex].phoneNo,
      email: this.userAddress[this.selectedAddressIndex].email,
      alternativePhoneNo: this.userAddress[this.selectedAddressIndex].alternativePhoneNo,
      area: this.userAddress[this.selectedAddressIndex].area,
      city: this.userAddress[this.selectedAddressIndex].city,
      postCode: this.userAddress[this.selectedAddressIndex].postCode,
      shippingAddress: this.userAddress[this.selectedAddressIndex].shippingAddress,
      deliveryDate: null,
      deliveryStatus: OrderStatus.PENDING,
      shippingFee: this.shippingCharge,
      subTotal: this.cartSubTotal,
      discount: this.finalDiscount,
      totalAmount: this.cartSubTotal + this.shippingCharge,
      totalAmountWithDiscount: this.finalDiscount > (this.cartSubTotal + this.shippingCharge) ? 0 : (this.cartSubTotal + this.shippingCharge - this.finalDiscount),
      deletedProduct: false,
      refundAmount: 0,
      paymentStatus: 'unpaid',
      hasPreorderItem: false,
      orderTimeline: {
        others: false,
        othersData: null,
        orderPlaced: false,
        orderPlacedDate: new Date(),
        orderProcessing: false,
        orderProcessingDate: null,
        orderPickedByDeliveryMan: false,
        orderPickedByDeliveryManDate: null,
        orderDelivered: false,
        orderDeliveredDate: null
      },
      couponId: this.couponData?._id,
      couponValue: null,
      orderedItems: products,
      orderNotes: this.orderNotes,
      sessionkey: null
    };


    this.openConfirmOrderDialog();

  }

  private sslInitWithOrder(orderId: string, id: string) {
    const baseHost = this.utilsService.getHostBaseUrl();

    const sslPaymentInit: SslInit = {
      store_id: null,
      store_passwd: null,
      total_amount: this.order.totalAmountWithDiscount,
      currency: this.currency,
      tran_id: orderId,
      success_url: baseHost + '/callback/payment/success',
      fail_url: baseHost + '/callback/payment/fail',
      cancel_url: baseHost + '/callback/payment/cancel',
      ipn_url: environment.sslIpnUrl,
      shipping_method: 'Courier',
      product_name: this.productsNameStr,
      product_category: this.productsCatStr,
      product_profile: 'general',
      cus_name: this.order.name,
      cus_email: this.order.email,
      cus_add1: this.order.shippingAddress,
      cus_add2: '',
      cus_city: this.order.city,
      cus_state: '',
      cus_postcode: this.order.postCode,
      cus_country: 'Bangladesh',
      cus_phone: this.order.phoneNo,
      cus_fax: '',
      ship_name: this.order.name,
      ship_add1: this.order.shippingAddress,
      ship_add2: '',
      ship_city: this.order.city,
      ship_state: '',
      ship_postcode: this.order.postCode,
      ship_country: 'Bangladesh',
      // multi_card_name: '',
      value_a: this.order.orderNotes,
      // value_b: '',
      // value_c: '',
      // value_d: ''
    };

    this.paymentSslService.initSSLPayment(sslPaymentInit)
      .subscribe(res => {
        const sslInitResponse: SslInitResponse = res.data;
        const sessionkey = sslInitResponse.sessionkey;
        this.orderService.updateOrderSessionKey(id, sessionkey)
          .subscribe(res3 => {
            const gatewayPageURL = sslInitResponse.GatewayPageURL;
            // window.open(gatewayPageURL);
            this.document.location.href = gatewayPageURL ? gatewayPageURL : '';
          }, error => {
            this.uiService.wrong('This order could not be processed at this time, please try again.');
          });

      }, error => {
        console.log(error);
      });
  }


  /**
   * BULK SMS
   */
  private sendSmsBySslAPi(phoneNo: string, message: string, uid: string) {
    const messageBody: BulkSms = {
      sms: message,
      csmsid: uid,
      msisdn: phoneNo
    };
    this.bulkSmsService.sendSmsBySslAPi(messageBody)
      .subscribe(res => {
        // console.log(res);
      }, error => {
        console.log(error);
      });
  }

  countSessionExpireTime(time: number) {
    const count = (num) => () => {
      this.expireCountDown = num;
      num = num === 0 ? 0 : num - 1;
      if (num <= 0) {
        clearInterval(this.timeInstanceExpire);
        this.expireCountDown = 0;
        this.document.location.reload();
      }
    };

    this.timeInstanceExpire = setInterval(count(time), 1000);
  }

  private getSettingInfo() {
    this.settingService.getSettingInfo()
      .subscribe(res => {
        this.setting = res.data;
        this.setPaymentTypes(res.data);
      }, err => {
        console.log(err);
      });
  }


  private setPaymentTypes(data: Setting){
    if (data.cashOnDelivery === true && data.onlinePayment === false) {
      this.paymentTypes = [
        {value: 'cash_on_delivery', viewValue: 'Cash on Delivery'}
      ];
    }
    if (data.cashOnDelivery === false && data.onlinePayment === true) {
      this.paymentTypes = [
        {value: 'online_payment', viewValue: 'Online Payment or Bkash, Nagad or Rocket' },
      ];
    }
    if (data.cashOnDelivery === true && data.onlinePayment === true) {
      this.paymentTypes = [
        {value: 'cash_on_delivery', viewValue: 'Cash on Delivery'},
        {value: 'online_payment', viewValue: 'Online Payment or Bkash, Nagad or Rocket' },
      ];
    }
  }

  ngOnDestroy() {

    if (this.timeInstanceExpire) {
      clearInterval(this.timeInstanceExpire);
    }
  }



}
