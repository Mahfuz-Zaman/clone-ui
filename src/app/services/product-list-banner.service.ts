import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {PromotionalOffer} from '../interfaces/promotional-offer';
import {Pagination} from '../interfaces/pagination';
import {ProductListBanner} from '../interfaces/product-list-banner';

const API_PROMOTIONAL_OFFER = environment.apiBaseLink + '/api/product-list-banner/';

@Injectable({
  providedIn: 'root'
})
export class ProductListBannerService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewProductListBanner(data: ProductListBanner) {
    return this.http.post<{ message: string }>(API_PROMOTIONAL_OFFER + 'add-new-product-list-banner', data);
  }

  // addNewPromotionalOfferMulti(data: ProductListBanner[]) {
  //   return this.http.post<{ message: string }>(API_PROMOTIONAL_OFFER + 'add-new-product-list-banner-multi', {data});
  // }

  getAllProductListBanner(pagination?: Pagination, select?: string) {
    let params = new HttpParams();
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.http.get<{ data: ProductListBanner[], count: number, message?: string }>
      (API_PROMOTIONAL_OFFER + 'get-all-product-list-banner-list', {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.http.get<{ data: ProductListBanner[], count: number, message?: string }>
      (API_PROMOTIONAL_OFFER + 'get-all-product-list-banner-list', {params});
    }
  }


  editProductListBanner(data: ProductListBanner) {
    return this.http.put<{ message: string }>(API_PROMOTIONAL_OFFER + 'edit-product-list-banner-by-id', data);
  }

  deletePromotionalOfferById(id: string) {
    return this.http.delete<{ message: string }>(API_PROMOTIONAL_OFFER + 'delete-product-list-banner-by-id/' + id);
  }

  getSingleProductListBannerById(id: string) {
    return this.http.get<{ data: ProductListBanner, message?: string }>(API_PROMOTIONAL_OFFER + 'get-product-list-banner-details-by-id/' + id);
  }

  getSinglePromotionalOfferBySlug(slug: string) {
    return this.http.get<{ data: ProductListBanner, message?: string }>(API_PROMOTIONAL_OFFER + 'get-roduct-list-banner-details-by-slug/' + slug);
  }

}
