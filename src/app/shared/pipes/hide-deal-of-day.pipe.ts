import {Pipe, PipeTransform} from '@angular/core';
import {DealsOfTheDay} from '../../interfaces/deals-of-the-day';
import {UtilsService} from '../../services/utils.service';

@Pipe({
  name: 'hideDealOfDay',
  pure: true
})
export class HideDealOfDayPipe implements PipeTransform {


  constructor(
    private utilsService: UtilsService
  ) {
  }

  transform(array: DealsOfTheDay[]): DealsOfTheDay[] {
    if (!Array.isArray(array)) {
      return;
    }
    const res = array.filter(m => {
      const timeLeft = this.utilsService.getDateDifference(new Date(m.endDate), new Date());
      if (timeLeft > 0) {
        return m;
      }
    });

    return res as DealsOfTheDay[];
  }

}
