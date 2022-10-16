import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../interfaces/pagination';
import {Warranty} from '../interfaces/warranty';


const API_WARRANTY = environment.apiBaseLink + '/api/warranty/';

@Injectable({
  providedIn: 'root'
})
export class WarrantyService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * WARRANTY
   */
  addWarranty(data: Warranty) {
    return this.httpClient.post<{ message: string }>(API_WARRANTY + 'add-single-warranty', data);
  }

  getWarrantDataByCustomer(data: {customerPhoneNo: string; select: string;}) {
    return this.httpClient.post<{ data: Warranty[], success: boolean, count: number }>(API_WARRANTY + 'get-warranty-data-by-customer', data);
  }

  checkWarrantByCustomerPhoneNo(data: {customerPhoneNo: string}) {
    return this.httpClient.post<{ success: boolean }>(API_WARRANTY + 'check-warranty-data-by-customer-phone-no', data);
  }


  trackWarrantDownloadHistory(id: string) {
    return this.httpClient.post<{ success: boolean }>(API_WARRANTY + 'track-warranty-download-history', {_id: id});
  }


  insertManyWarranty(data: Warranty[]) {
    return this.httpClient.post<{message: string}>(API_WARRANTY + 'add-multiple-warranty', data);
  }


  getAllWarranty(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: Warranty[], message?: string, count: number }>(API_WARRANTY + 'get-all-warranty', {params});
    } else {
      return this.httpClient.get<{ data: Warranty[], message?: string, count: number }>(API_WARRANTY + 'get-all-warranty');
    }

  }


  getWarrantyByWarrantyId(id: string) {
    return this.httpClient.get<{ data: Warranty, message?: string }>(API_WARRANTY + 'get-warranty-by-warranty-id/' + id);
  }

  editWarrantyData(data: Warranty) {
    return this.httpClient.put<{message?: string}>(API_WARRANTY + 'edit-warranty-by-warranty', data);
  }

  deleteWarranty(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_WARRANTY + 'delete-warranty-by-id/' + id);
  }


  getSearchWarranty(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: Warranty[], count: number }>(API_WARRANTY + 'get-warranty-by-search', paginate, {params});
  }



}
