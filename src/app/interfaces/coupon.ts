import {User} from './user';

export interface Coupon {
  _id?: string;
  couponName: string;
  couponAmount: number;
  couponCode: string;
  couponType: number;
  couponDiscountType: number;
  couponLimit: number;
  couponMinPurchase: number;
  couponStartDate: string;
  couponEndDate: string;
  couponUsedByUser: string[] | User[];
}
