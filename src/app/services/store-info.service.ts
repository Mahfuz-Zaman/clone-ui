import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {StoreInfo} from '../interfaces/store-info';


const API_STORE_INFO = environment.apiBaseLink + '/api/store-info/';

@Injectable({
  providedIn: 'root'
})

// tslint:disable-next-line:class-name
export class StoreInfoService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * ATTRIBUTES
   */
  addStoreInfo(data: StoreInfo) {
    return this.httpClient.post<{message: string}>(API_STORE_INFO + 'add-store-info', data);
  }

  getAllStoresInfo() {
    return this.httpClient.get<{data: StoreInfo[], message?: string}>(API_STORE_INFO + 'get-all-store-info');
  }

  getStoreInfoByStoreInfoId(id: string) {
    return this.httpClient.get<{data: StoreInfo, message?: string}>(API_STORE_INFO + 'get-store-info-by-store-info-id/' + id);
  }

  editStoreInfo(data: StoreInfo) {
    return this.httpClient.put<{message: string}>(API_STORE_INFO + 'edit-store-info-by-store-info', data);
  }

  getStoreInfoBySearch(id: string) {
    return this.httpClient.get<{ data: StoreInfo, message?: string }>(API_STORE_INFO + 'get-store-info-by-search/' + id);
  }

  deleteStoreInfoByStoreInfoId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_STORE_INFO + 'delete-store-info-by-id/' + id);
  }







}
