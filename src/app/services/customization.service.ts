import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Carousel} from '../interfaces/carousel';
import {PageInfo} from '../interfaces/page-info';
import {Observable} from 'rxjs';


const API_CUSTOMIZATION = environment.apiBaseLink + '/api/customization/';

@Injectable({
  providedIn: 'root'
})
export class CustomizationService {

  carousels: Carousel[] = [];

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * CAROUSEL
   */
  addNewCarousel(data: Carousel) {
    return this.httpClient.post<{ message: string }>(API_CUSTOMIZATION + 'add-new-carousel', data);
  }

  getAllCarousel() {
    return this.httpClient.get<{ data: Carousel[] }>(API_CUSTOMIZATION + 'get-all-carousel');
  }

  getSingleCarouselById(id: string) {
    return this.httpClient.get<{ data: Carousel }>(API_CUSTOMIZATION + 'get-single-carousel-by-id/' + id);
  }

  deleteCarouselById(id: string) {
    return this.httpClient.delete<{ message: string }>(API_CUSTOMIZATION + 'delete-carousel-by-id/' + id);
  }

  editCarouselById(data: any) {
    return this.httpClient.put<{ message: string }>(API_CUSTOMIZATION + 'edit-carousel-by-id', data);
  }


  /**
   * PAGE INFO
   */
  addPageInfo(data: PageInfo) {
    return this.httpClient.post<{ message: string }>(API_CUSTOMIZATION + 'add-page-info', data);
  }

  getPageInfoBySlug(slug: string) {
    return this.httpClient.get<{ data: PageInfo }>(API_CUSTOMIZATION + 'get-page-info/' + slug);
  }

  /**
   * Get No Repeat Data
   */

  getAllCarouselNoRepeat(select?: string): Observable<{ data: Carousel[] }> {
    return new Observable((observer) => {
      if (this.carousels.length > 0) {
        observer.next({data: this.carousels});
        observer.complete();
      } else {
        let params = new HttpParams();
        if (select) {
          params = params.append('select', select);
        }
        this.httpClient.get<{ data: Carousel[] }>(API_CUSTOMIZATION + 'get-all-carousel', {params})
          .subscribe((res) => {
            this.carousels = res.data;
            observer.next({data: this.carousels});
            observer.complete();
          }, error => {
            console.log(error);
          });
      }

    });
  }


}
