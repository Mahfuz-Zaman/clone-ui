import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ShopInfo} from '../interfaces/shop-info';

const API_HOMEPAGE = environment.apiBaseLink + '/api/homepage-lists/';
const API_SHOP_INFO = environment.apiBaseLink + '/api/shop-info/';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * SHOP
   */

  getAllLists() {
    return this.httpClient.get<{ data: any, message: string }>(API_HOMEPAGE + 'get-all-lists');
  }

  /**
   * SHOP INFO
   */

  addShopInfo(data: ShopInfo) {

    console.log(data);
    return this.httpClient.post<{ message: string }>(API_SHOP_INFO + '/add-shop-info', data);

  }

  getShopInfo() {
    return this.httpClient.get<{ data: ShopInfo, message?: string }>(API_SHOP_INFO + '/get-all-shop-info');
  }

  updateShopInfo(data: ShopInfo) {
    return this.httpClient.put<{ message: string }>(API_SHOP_INFO + '/update-shop-info', data);
  }


}
