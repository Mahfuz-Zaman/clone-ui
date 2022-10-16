import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductAttribute} from '../interfaces/product-attribute';
import {Newsletter} from '../interfaces/newsletter';
import {Pagination} from '../interfaces/pagination';
import {Product} from '../interfaces/product';


const API_ATTRIBUTE = environment.apiBaseLink + '/api/product-attribute/';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(
    private httpClient: HttpClient
  ) { }

  /**
   * ATTRIBUTES
   */
  addAttribute(data: ProductAttribute) {
    return this.httpClient.post<{message: string}>(API_ATTRIBUTE + 'add-attribute', data);
  }

  insertManyAttribute(data: ProductAttribute[]) {
    return this.httpClient.post<{message: string}>(API_ATTRIBUTE + 'add-multiple-attribute', data);
  }


  getAllAttributes(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{data: ProductAttribute[], message?: string, count?: number}>(API_ATTRIBUTE + 'get-all-attributes', {params});
    } else {
      return this.httpClient.get<{data: ProductAttribute[], message?: string, count?: number}>(API_ATTRIBUTE + 'get-all-attributes');
    }

  }

  getAttributeByAttributeId(id: string) {
    return this.httpClient.get<{data: ProductAttribute, message?: string}>(API_ATTRIBUTE + 'get-attribute-by-attribute-id/' + id);
  }

  editAttributeData(data: ProductAttribute) {
    return this.httpClient.put<{message: string}>(API_ATTRIBUTE + 'edit-attribute-by-attribute', data);
  }

  deleteAttribute(id: string) {
    return this.httpClient.delete<{message?: string}>(API_ATTRIBUTE + 'delete-attributes-by-id/' + id);
  }

  getSearchAttribute(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: ProductAttribute[], count: number }>(API_ATTRIBUTE + 'get-attributes-by-search', paginate, {params});
  }







}
