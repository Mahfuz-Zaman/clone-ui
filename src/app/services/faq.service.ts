import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Faq} from '../interfaces/faq';

const API_FAQ = environment.apiBaseLink + '/api/faq/';


@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * BRAND
   */
  addFaq(data: Faq) {
    return this.httpClient.post<{message: string}>(API_FAQ + 'add-faq', data);
  }

  getAllFaq() {
    return this.httpClient.get<{data: Faq[], message?: string}>(API_FAQ + 'get-all-faq');
  }

  getFaqByFaqId(id: string) {
    return this.httpClient.get<{data: Faq, message?: string}>(API_FAQ + 'get-faq-by-faq-id/' + id);
  }

  getSingleFaqBySlug(slug: string) {
    return this.httpClient.get<{ data: Faq, message: string }>(API_FAQ + 'get-single-faq-by-slug/' + slug);
  }

  editFaqData(data: Faq) {
    return this.httpClient.put<{message?: string}>(API_FAQ + 'edit-faq-by-faq', data);
  }

  deleteFaqByFaqId(id: string) {
    return this.httpClient.delete<{message?: string}>(API_FAQ + 'delete-faq-by-id/' + id);
  }
}
