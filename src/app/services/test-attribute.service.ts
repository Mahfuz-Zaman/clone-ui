import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ProductAttribute} from '../interfaces/product-attribute';

const API_PRODUCT_ATTRIBUTE = environment.apiBaseLink + '/api/product-attribute/';

@Injectable({
  providedIn: 'root'
})
export class TestAttributeService {

  constructor(
    private httpClient: HttpClient
  ) { }

  addAttribute(data: ProductAttribute) {
    return this.httpClient.post<{message: string}>(API_PRODUCT_ATTRIBUTE + 'add-attribute', data);
  }

  getAllAttributes() {
    return this.httpClient.get<{data: ProductAttribute[], message: string}>(API_PRODUCT_ATTRIBUTE + 'get-all-attributes');
  }

  getAttributeByAttributeId(id: string) {
    return this.httpClient.get<{data: ProductAttribute, message: string}>(API_PRODUCT_ATTRIBUTE + 'get-attribute-by-attribute-id/' + id);
  }

  getAttributesBySearch(data: any) {
    return this.httpClient.post<{data: ProductAttribute[], count: number}>(API_PRODUCT_ATTRIBUTE + 'get-attributes-by-search', data);
  }

  deleteAttributeByAttributeId(id: string) {
    return this.httpClient.delete<{message: string}>(API_PRODUCT_ATTRIBUTE + 'delete-attributes-by-id/' + id);
  }


}
