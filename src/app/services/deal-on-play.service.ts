import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {DealOnPlay} from '../interfaces/deal-on-play';
import {Observable} from 'rxjs';

const API_DEAL_ON_PLAY = environment.apiBaseLink + '/api/deal-on-play/';

@Injectable({
  providedIn: 'root'
})
export class DealOnPlayService {

  allDealOnPlay: DealOnPlay[] = [];

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewDealOnPlay(data: DealOnPlay) {
    return this.http.post<{ message: string }>(API_DEAL_ON_PLAY + 'add-new-deal-on-play', data);
  }


  getAllDealOnPlay(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{ data: DealOnPlay[], count: number, message?: string }>
      (API_DEAL_ON_PLAY + 'get-all-deal-on-play-list', {params});
    } else {
      return this.http.get<{ data: DealOnPlay[], count: number, message?: string }>
      (API_DEAL_ON_PLAY + 'get-all-deal-on-play-list');
    }
  }


  getSingleDealOnPlayById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: DealOnPlay, message?: string }>(API_DEAL_ON_PLAY + 'get-deal-on-play-by-id/' + id, {params});
  }

  getSingleDealOnPlayBySlug(slug: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    return this.http.get<{ data: any, message: string }>(API_DEAL_ON_PLAY + 'get-single-deal-on-play-by-slug/' + slug, {params});
  }

  editDealOnPlay(data: DealOnPlay) {
    return this.http.put<{ message: string }>(API_DEAL_ON_PLAY + 'edit-deal-on-play-by-id', data);
  }

  deleteDealOnPlayById(id: string) {
    return this.http.delete<{ message: string }>(API_DEAL_ON_PLAY + 'delete-deal-on-play-by-id/' + id);
  }


  /**
   * Get No Repeat Data
   */

  getAllDealOnPlayNoRepeat(): Observable<{ data: DealOnPlay[] }> {
    return new Observable((observer) => {
      if (this.allDealOnPlay.length > 0) {
        observer.next({data: this.allDealOnPlay});
        observer.complete();
      } else {
        this.http.get<{ data: DealOnPlay[] }>(API_DEAL_ON_PLAY + 'get-all-deal-on-play-list')
          .subscribe((res) => {
            this.allDealOnPlay = res.data;
            observer.next({data: this.allDealOnPlay});
            observer.complete();
          }, error => {
            console.log(error);
          });
      }
    });
  }


}
