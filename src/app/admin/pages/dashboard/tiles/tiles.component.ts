import { Component, OnInit } from '@angular/core';
import { GeneralInfoService } from 'src/app/services/general-info.service';
import {REPORT_FILTER} from '../../../../core/utils/app-data';
import {Select} from '../../../../interfaces/select';
import {MatSelectChange} from '@angular/material/select';
import {UtilsService} from '../../../../services/utils.service';

@Component({
  selector: 'app-tiles',
  templateUrl: './tiles.component.html',
  styleUrls: ['./tiles.component.scss']
})
export class TilesComponent implements OnInit {
  products:Number;
  orders: Number;
  users: Number;
  transactions: Number;

  // Report Select
  reportsFilters: Select[] = REPORT_FILTER;

  // Query;
  query: any = null;

  constructor(
    private utilsService: UtilsService,
    private generalInfoService: GeneralInfoService
  ) { }

  ngOnInit(
    ): void {
      this.fetchData();
  }

  onFilterData(event: MatSelectChange) {
    if (event.source.value) {
      const startDate = this.utilsService.getDateBySubtract(event.source.value, null, true);
      const endDate = this.utilsService.getDateString(new Date());
      this.query = {dateString: {$gte: startDate, $lt: endDate}};
      this.fetchData();
    } else {
      const startDate = this.utilsService.getDateBySubtract(1, null, true);
      const endDate = this.utilsService.getDateString(new Date());
      this.query = {dateString: {$gte: startDate, $lt: endDate}};
      this.fetchData();
    }

  }
  fetchData(){
    // Order Counts
    this.generalInfoService.getOrderCount()
      .subscribe(res => {
        this.orders = res.count;
      })

    // User Counts
    this.generalInfoService.getUserCount()
      .subscribe(res => {
        this.users = res.count;
      })

    // Proudct Counts
    this.generalInfoService.getProductCount()
      .subscribe(res => {
        this.products = res.count;
      })

    // Transaction Counts
    this.generalInfoService.getTransactionCount()
      .subscribe(res => {
        this.transactions = res.count;
      })
  }
}
