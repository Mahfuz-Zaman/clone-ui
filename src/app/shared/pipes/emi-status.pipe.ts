import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emiStatus'
})
export class EmiStatusPipe implements PipeTransform {

  transform(status: number, type?: string): unknown {

    switch (status) {
      case 3 : {
        return '3 Months';
      }
      case 6 : {
        return '6 Months';
      }
      case 12 : {
        return '12 Months';
      }
      default: {
        return '-';
      }
    }

  }

}
