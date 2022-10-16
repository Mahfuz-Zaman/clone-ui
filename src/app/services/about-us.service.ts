import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {AboutUs} from '../interfaces/about-us';

const API_ABOUT_US = environment.apiBaseLink + '/api/about-us/';


@Injectable({
  providedIn: 'root'
})
export class AboutUsService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * BRAND
   */
  addAboutUs(data: AboutUs) {
    return this.httpClient.post<{message: string}>(API_ABOUT_US + 'add-about-us', data);
  }

  getAboutUsPages(select?: string) {
    let params = new HttpParams();
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.get<{data: AboutUs[], message?: string}>(API_ABOUT_US + 'get-all-about-us-pages', {params});
  }

  getAboutUsByAboutUsID(id: string) {
    return this.httpClient.get<{data: AboutUs, message?: string}>(API_ABOUT_US + 'get-about-us-by-about-us-id/' + id);
  }

  getSingleAboutUsBySlug(slug: string) {
    return this.httpClient.get<{ data: AboutUs, message: string }>(API_ABOUT_US + 'get-single-about-us-by-slug/' + slug);
  }

  editAboutUsData(data: AboutUs) {
    return this.httpClient.put<{message?: string}>(API_ABOUT_US + 'edit-about-us-by-about-us', data);
  }

  deleteAboutUs(id: string) {
    return this.httpClient.delete<{message?: string}>(API_ABOUT_US + 'delete-about-us-by-id/' + id);
  }
}
