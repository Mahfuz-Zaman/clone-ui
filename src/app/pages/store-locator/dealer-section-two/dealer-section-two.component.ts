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

  stores: StoreInfo[] = [];

  storeMap: string = null;

  activeIndex = -1;


  constructor(
    private dialog: MatDialog,
    private uiService: UiService,
    private reloadService: ReloadService,
    private storeInfoService: StoreInfoService,
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshStoreInfos$
      .subscribe(() => {
        this.getAllStoresInfo();
      });
    this.getAllStoresInfo();

  }

  getSingleStore(data: StoreInfo, index: number) {
    this.activeIndex = index;
    this.storeMap = data.map;
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllStoresInfo() {
    this.storeInfoService.getAllStoresInfo()
      .subscribe(res => {
        this.stores = res.data;
        if (this.stores && this.stores.length) {
          this.activeIndex = 0;
          this.storeMap = this.stores[0].map;
        }
      }, error => {
        console.log(error);
      });
  }


}
