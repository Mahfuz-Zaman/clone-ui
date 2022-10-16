import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {OfferProduct} from '../interfaces/offer-product';

const API_OFFER_PRODUCT = environment.apiBaseLink + '/api/offer-product/';

@Injectable({
  providedIn: 'root'
})
export class OfferProductService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewOfferProduct(data: OfferProduct) {
    return this.http.post<{ message: string }>(API_OFFER_PRODUCT + 'add-new-offer-product', data);
  }


  getAllOfferProduct(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{ data: OfferProduct[], count: number, message?: string }>
      (API_OFFER_PRODUCT + 'get-all-offer-product-list', {params});
    } else {
      return this.http.get<{ data: OfferProduct[], count: number, message?: string }>
      (API_OFFER_PRODUCT + 'get-all-offer-product-list');
    }
  }

  getSingleOfferProductById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ data: OfferProduct, message?: string }>(API_OFFER_PRODUCT + 'get-offer-product-by-id/' + id, {params});
  }

  getOfferProductBySlug(slug: string) {
    return this.http.get<{ data: OfferProduct[], message: string }>(API_OFFER_PRODUCT + 'get-offer-product-by-slug/' + slug);
  }


  editOfferProduct(data: OfferProduct) {
    return this.http.put<{ message: string }>(API_OFFER_PRODUCT + 'edit-offer-product-by-id', data);
  }

  deleteOfferProductById(id: string) {
    return this.http.delete<{ message: string }>(API_OFFER_PRODUCT + 'delete-offer-product-by-id/' + id);
  }


}
