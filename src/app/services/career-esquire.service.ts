import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CareerEsquire} from '../interfaces/career-esquire';

const API_CAREER_ESQUIRE = environment.apiBaseLink + '/api/career-esquire/';


@Injectable({
  providedIn: 'root'
})
export class CareerEsquireService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * CareerEsquire
   */
  addCareerEsquire(data: CareerEsquire) {
    return this.httpClient.post<{message: string}>(API_CAREER_ESQUIRE + 'add-career-esquire', data);
  }

  getAllCareerEsquire() {
    return this.httpClient.get<{data: CareerEsquire[], message?: string}>(API_CAREER_ESQUIRE + 'get-all-career-esquire');
  }

  getCareerEsquireByID(id: string) {
    return this.httpClient.get<{data: CareerEsquire, message?: string}>(API_CAREER_ESQUIRE + 'get-career-esquire-by-career-esquire-id/' + id);
  }

  getSingleCareerEsquireBySlug(slug: string) {
    return this.httpClient.get<{ data: CareerEsquire, message: string }>(API_CAREER_ESQUIRE + 'get-single-career-esquire-by-slug/' + slug);
  }

  editCareerEsquireData(data: CareerEsquire) {
    return this.httpClient.put<{message?: string}>(API_CAREER_ESQUIRE + 'edit-career-esquire-by-career-esquire', data);
  }

  deleteCareerEsquire(id: string) {
    return this.httpClient.delete<{message?: string}>(API_CAREER_ESQUIRE + 'delete-career-esquire-by-id/' + id);
  }
}
