import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../interfaces/pagination';
import {Newsletter} from '../interfaces/newsletter';


const API_NEWSLETTER = environment.apiBaseLink + '/api/newsletter/';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  addNewsletter(data: object) {
    return this.httpClient.post<{ message: string }>(API_NEWSLETTER + 'add-newsletter', data);
  }

  getNewsletters(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: Newsletter[], count: number, message?: string }>(API_NEWSLETTER + 'get-all-newsletter', {params});
    } else {
      return this.httpClient.get<{ data: Newsletter[], count: number, message?: string }>(API_NEWSLETTER + 'get-all-newsletter');
    }
  }


  updateNewsletter(data: Newsletter) {
    return this.httpClient.put<{ message: string }>(API_NEWSLETTER + 'update-newsletter', data);
  }

  deleteNewsletter(id: string) {
    return this.httpClient.delete<{ message: string }>(API_NEWSLETTER + 'delete-newsletter/' + id);
  }


}
