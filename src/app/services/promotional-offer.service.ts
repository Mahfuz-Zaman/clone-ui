import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {PromotionalOffer} from '../interfaces/promotional-offer';

const API_PROMOTIONAL_OFFER = environment.apiBaseLink + '/api/promotional-offer/';

@Injectable({
  providedIn: 'root'
})
export class PromotionalOfferService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewPromotionalOffer(data: PromotionalOffer) {
    return this.http.post<{ message: string }>(API_PROMOTIONAL_OFFER + 'add-new-promotional-offer', data);
  }

  addNewPromotionalOfferMulti(data: PromotionalOffer[]) {
    return this.http.post<{ message: string }>(API_PROMOTIONAL_OFFER + 'add-new-promotional-offer-multi', {data});
  }

  getAllPromotionalOffer(pagination?: Pagination, select?: string) {
    let params = new HttpParams();
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.http.get<{ data: PromotionalOffer[], count: number, message?: string }>
      (API_PROMOTIONAL_OFFER + 'get-all-promotional-offer-list', {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.http.get<{ data: PromotionalOffer[], count: number, message?: string }>
      (API_PROMOTIONAL_OFFER + 'get-all-promotional-offer-list', {params});
    }
  }


  editPromotionalOfferData(data: PromotionalOffer) {
    return this.http.put<{ message: string }>(API_PROMOTIONAL_OFFER + 'edit-promotional-offer-by-id', data);
  }

  deletePromotionalOfferById(id: string) {
    return this.http.delete<{ message: string }>(API_PROMOTIONAL_OFFER + 'delete-promotional-offer-by-id/' + id);
  }

  getSinglePromotionalOfferById(id: string) {
    return this.http.get<{ data: PromotionalOffer, message?: string }>(API_PROMOTIONAL_OFFER + 'get-promotional-offer-details-by-id/' + id);
  }

  getSinglePromotionalOfferBySlug(slug: string) {
    return this.http.get<{ data: PromotionalOffer, message?: string }>(API_PROMOTIONAL_OFFER + 'get-promotional-offer-details-by-slug/' + slug);
  }

}
