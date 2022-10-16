import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
const API_GENERAL_INFO=environment.apiBaseLink+'/api/general-info/'
@Injectable({
  providedIn: 'root'
})
export class GeneralInfoService {

  constructor( private httpClient: HttpClient) { }

  getUserCount() {
    return this.httpClient.get<{ count: Number, message?: string }>(API_GENERAL_INFO + 'get-users-count');
  }
  getOrderCount(){
    return this.httpClient.get<{ count: Number, message?: string }>(API_GENERAL_INFO + 'get-orders-count');
  }
  
  getProductCount(){
    return this.httpClient.get<{ count: Number, message?: string }>(API_GENERAL_INFO + 'get-product-count');
  }
  
  getTransactionCount(){
    return this.httpClient.get<{ count: Number, message?: string }>(API_GENERAL_INFO + 'get-transaction-count');
  }
}
