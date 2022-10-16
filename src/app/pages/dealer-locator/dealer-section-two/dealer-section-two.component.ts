import { Component, OnInit } from '@angular/core';
import {StoreInfo} from '../../../interfaces/store-info';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {StoreInfoService} from '../../../services/store-info.service';
import {DealerInfo} from '../../../interfaces/dealer-info';
import {DealerInfoService} from '../../../services/dealer-info.service';


declare const L: any;

@Component({
  selector: 'app-dealer-section-two',
  templateUrl: './dealer-section-two.component.html',
  styleUrls: ['./dealer-section-two.component.scss']
})
export class DealerSectionTwoComponent implements OnInit {

  dealers: DealerInfo[] = [];
  private dealer: DealerInfo;

  selectedLatitude: string = null;
  selectedLongitude: string = null;
  selectedStoreName: string = null;
  selectedId: string = null;

  dealerMap: string = null;

  activeIndex = -1;


  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private storeInfoService: StoreInfoService,
    private dealerInfoService: DealerInfoService
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshDealerInfo$
      .subscribe(() => {
        this.getAllDealersInfo();
      });

    this.getAllDealersInfo();
  }

  getSingleStore(data: StoreInfo) {
    this.dealerMap = data.map;
  }

  /**
   * HTTP REQ HANDLE
   */


  private getAllDealersInfo() {
    this.dealerInfoService.getAllDealersInfo()
      .subscribe(res => {
        this.dealers = res.data;
        if (this.dealers && this.dealers.length) {
          this.activeIndex = 0;
          this.dealerMap = this.dealers[0].map;
        }
      }, error => {
        console.log(error);
      });
  }

  getSingleDealer(data: DealerInfo, index: number) {
    this.activeIndex = index;
    this.dealerMap = data.map;
  }
}
