import {Pipe, PipeTransform} from '@angular/core';
import {Product} from '../../interfaces/product';
import {DiscountTypeEnum} from '../../enum/discount-type.enum';

@Pipe({
  name: 'discount'
})
export class DiscountPipe implements PipeTransform {

  transform(product: Product, type: string): number {

    switch (type) {
      case 'percentage': {
        if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
          return product?.discountAmount;
        } else if (product.discountType === DiscountTypeEnum.CASH) {
          const percent = Number((product?.discountAmount * 100) / product?.price);
          // return Number(percent.toFixed(2));
          return Math.round(percent);
        } else {
          return 0;
        }
      }
      case 'amount': {
        if (product.discountType === DiscountTypeEnum.PERCENTAGE) {
          return (product?.discountAmount / 100) * product?.price;
        } else if (product.discountType === DiscountTypeEnum.CASH) {
          return product?.discountAmount;
        } else {
          return 0;
        }
      }
      default: {
        return product?.price;
      }
    }

  }

}
