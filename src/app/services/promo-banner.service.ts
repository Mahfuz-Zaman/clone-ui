import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PromoBanner } from '../interfaces/promo-banner';

const API_PROMO_BANNER = environment.apiBaseLink + '/api/product-promo-banner/';

@Injectable({
  providedIn: 'root',
})
export class PromoBannerService {
  constructor(private httpClient: HttpClient) {}

  /**
   * SHOP INFO
   */

  addPromoBanner(data: PromoBanner) {
    console.log(data);
    return this.httpClient.post<{ message: string }>(
      API_PROMO_BANNER + 'add-promo-banner-info',
      data
    );
  }

  getPromoBanner() {
    return this.httpClient.get<{ data: PromoBanner; message?: string }>(
      API_PROMO_BANNER + '/get-all-promo-banner-info'
    );
  }

  getPromoBannerByID(id: string) {
    return this.httpClient.get<{ data: PromoBanner; message?: string }>(
      API_PROMO_BANNER + 'get-promo-banner-by-id/' + id
    );
  }
  editPromoBanner(data: PromoBanner) {
    return this.httpClient.put<{ message?: string }>(
      API_PROMO_BANNER + 'edit-promo-banner',
      data
    );
  }

  updatePromoBannerInfo(data: PromoBanner) {
    return this.httpClient.put<{ message: string }>(
      API_PROMO_BANNER + '/update-promo-banner-info',
      data
    );
  }

  deletePromoBanner(id: string) {
    return this.httpClient.delete<{ message: string }>(
      API_PROMO_BANNER + '/delete-promo-banner-by-id/' + id
    );
  }
}
