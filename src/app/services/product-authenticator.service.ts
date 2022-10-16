import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../interfaces/pagination';
import {ProductAuthenticator} from '../interfaces/product-authenticator';


const API_AUTHENTICATOR = environment.apiBaseLink + '/api/product-authenticator/';

@Injectable({
  providedIn: 'root'
})
export class ProductAuthenticatorService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * WARRANTY
   */
  addProductAuthenticator(data: ProductAuthenticator) {
    return this.httpClient.post<{ message: string }>(API_AUTHENTICATOR + 'add-single-product-authenticator', data);
  }

  checkProductAuthenticate(data: {imeiOrSn: string}) {
    return this.httpClient.post<{ success: boolean }>(API_AUTHENTICATOR + 'check-product-authenticator-data', data);
  }

  insertManyProductAuthenticator(data: ProductAuthenticator[]) {
    return this.httpClient.post<{message: string}>(API_AUTHENTICATOR + 'add-multiple-product-authenticator', data);
  }


  getAllProductAuthenticator(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: ProductAuthenticator[], message?: string, count: number }>(API_AUTHENTICATOR + 'get-all-product-authenticator', {params});
    } else {
      return this.httpClient.get<{ data: ProductAuthenticator[], message?: string, count: number }>(API_AUTHENTICATOR + 'get-all-product-authenticator');
    }

  }


  getProductAuthenticatorById(id: string) {
    return this.httpClient.get<{ data: ProductAuthenticator, message?: string }>(API_AUTHENTICATOR + 'get-product-authenticator-by-id/' + id);
  }

  editProductAuthenticatorData(data: ProductAuthenticator) {
    return this.httpClient.put<{message?: string}>(API_AUTHENTICATOR + 'edit-product-authenticator-by-product-authenticator', data);
  }

  deleteProductAuthenticator(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_AUTHENTICATOR + 'delete-product-authenticator-by-id/' + id);
  }


  getSearchProductAuthenticator(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: ProductAuthenticator[], count: number }>(API_AUTHENTICATOR + 'get-product-authenticator-by-search', paginate, {params});
  }



}
