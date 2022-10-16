import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {CouponType} from '../../../../enum/coupon-type';
import {CouponDiscountType} from '../../../../enum/coupon-discount-type';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {Subscription} from 'rxjs';
import {Coupon} from '../../../../interfaces/coupon';
import {CouponService} from '../../../../services/coupon.service';
import {UtilsService} from '../../../../services/utils.service';
import {StorageService} from '../../../../services/storage.service';
import {Select} from '../../../../interfaces/select';

@Component({
  selector: 'app-add-coupon',
  templateUrl: './add-coupon.component.html',
  styleUrls: ['./add-coupon.component.scss']
})
export class AddCouponComponent implements OnInit, OnDestroy {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  dataForm: FormGroup;
  isLoading: false;
  private sub: Subscription;

  couponType: Select[] = [
    {value: CouponType.AMOUNT, viewValue: 'Amount'},
    {value: CouponType.PERCENTAGE, viewValue: 'Percentage'},
  ];

  couponDiscountType: Select[] = [
    {value: CouponDiscountType.ORDERDISCOUNT, viewValue: 'Order-Discount'},
    {value: CouponDiscountType.SHIPPINGDISCOUNT, viewValue: 'Shipping-Discount'},
    {value: CouponDiscountType.TOTALDISCOUNT, viewValue: 'Total-Discount'},
  ];

  // Store Data from param
  id?: string;
  coupon: Coupon;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private couponService: CouponService,
    private utilsService: UtilsService,
    private storageService: StorageService,
    public router: Router
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      couponName: [null, Validators.required],
      couponAmount: [null, Validators.required],
      couponCode: [null, Validators.required],
      couponType: [null, Validators.required],
      couponDiscountType: [null, Validators.required],
      couponLimit: [null],
      couponMinPurchase: [null, Validators.required],
      couponStartDate: [null, Validators.required],
      couponEndDate: [null, Validators.required]
    });

    // IF HAVE DATA ON SESSION
    if (this.storageService.getStoredInput('COUPON_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('COUPON_INPUT'));
    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCouponCouponId();
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    const mData = {
      ...this.dataForm.value,
      ...{
        couponStartDate: this.utilsService.getDateString(this.dataForm.value.couponStartDate),
        couponEndDate: this.utilsService.getDateString(this.dataForm.value.couponEndDate),
      }
    };

    if (this.coupon) {
      const finalData = {...mData, ...{_id: this.coupon._id}};
      this.editCouponData(finalData);
    } else {
      this.addNewCoupon(mData);
    }
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewCoupon(data: Coupon) {
    this.couponService.addNewCoupon(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('COUPON_INPUT');
      }, error => {
        console.log(error);
      });
  }

  private getCouponCouponId() {
    this.couponService.getCouponCouponId(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
          // @ts-ignore
          this.coupon = res.data;
        }
      }, error => {
        console.log(error);
      });
  }

  private editCouponData(data: Coupon) {
    this.couponService.editCouponData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('COUPON_INPUT');
      }, error => {
        console.log(error);
      });
  }


  ngOnDestroy() {
    this.storageService.removeSessionData('COUPON_INPUT');
  }
}
