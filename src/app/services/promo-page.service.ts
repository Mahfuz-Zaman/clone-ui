import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {PromoPage} from '../interfaces/promo-page';
import {ProductBrand} from '../interfaces/product-brand';

const API_PROMO_PAGE = environment.apiBaseLink + '/api/promo-page/';

@Injectable({
  providedIn: 'root'
})
export class PromoPageService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * SHOP INFO
   */

  addPromoPage(data: PromoPage) {

    console.log(data);
    return this.httpClient.post<{ message: string }>(API_PROMO_PAGE + '/add-promo-page-info', data);

  }

  getPromoPage() {
    return this.httpClient.get<{ data: PromoPage, message?: string }>(API_PROMO_PAGE + '/get-all-promo-page-info');
  }

  getPromoPageByID(id: string) {
    return this.httpClient.get<{data: PromoPage, message?: string}>(API_PROMO_PAGE + 'get-promo-page-by-id/' + id);
  }
  editPromoPage(data: PromoPage) {
    return this.httpClient.put<{message?: string}>(API_PROMO_PAGE + 'edit-promo-page', data);
  }

  updatePromoPageInfo(data: PromoPage) {
    return this.httpClient.put<{ message: string }>(API_PROMO_PAGE + '/update-promo-page-info', data);
  }

  deletePromoPage(id: string) {
    return this.httpClient.delete<{ message: string }>(API_PROMO_PAGE + '/delete-promo-page-by-id/' + id);
  }


}
