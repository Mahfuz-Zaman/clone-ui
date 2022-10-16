import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {DealerInfo} from '../interfaces/dealer-info';


const API_DEALER_INFO = environment.apiBaseLink + '/api/dealer-info/';

@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class DealerInfoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * ATTRIBUTES
   */
  addDealerInfo(data: DealerInfo) {
    return this.httpClient.post<{message: string}>(API_DEALER_INFO + 'add-dealer-info', data);
  }

  getAllDealersInfo() {
    return this.httpClient.get<{data: DealerInfo[], message?: string}>(API_DEALER_INFO + 'get-all-dealer-info');
  }

  getDealerInfoByDealerInfoId(id: string) {
    return this.httpClient.get<{data: DealerInfo, message?: string}>(API_DEALER_INFO + 'get-dealer-info-by-dealer-info-id/' + id);
  }

  editDealerInfo(data: DealerInfo) {
    return this.httpClient.put<{message: string}>(API_DEALER_INFO + 'edit-dealer-info-by-dealer-info', data);
  }

  getDealerInfoBySearch(id: string) {
    return this.httpClient.get<{ data: DealerInfo, message?: string }>(API_DEALER_INFO + 'get-dealer-info-by-search/' + id);
  }

  deleteDealerInfoByDealerInfoId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_DEALER_INFO + 'delete-dealer-info-by-id/' + id);
  }
}
