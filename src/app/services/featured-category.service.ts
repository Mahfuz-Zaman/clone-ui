import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {FeaturedCategory} from '../interfaces/featured-category';
import {Observable} from 'rxjs';

const API_FEATURED_CATEGORY = environment.apiBaseLink + '/api/featured-category/';

@Injectable({
  providedIn: 'root'
})
export class FeaturedCategoryService {

  allFeaturedCategory: FeaturedCategory[] = [];

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewFeaturedCategory(data: FeaturedCategory) {
    return this.http.post<{ message: string }>(API_FEATURED_CATEGORY + 'add-new-featured-category', data);
  }


  getAllFeaturedCategory(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{ data: FeaturedCategory[], count: number, message?: string }>
      (API_FEATURED_CATEGORY + 'get-all-featured-category-list', {params});
    } else {
      return this.http.get<{ data: FeaturedCategory[], count: number, message?: string }>
      (API_FEATURED_CATEGORY + 'get-all-featured-category-list');
    }
  }


  getSingleFeaturedCategoryById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ data: FeaturedCategory, message?: string }>(API_FEATURED_CATEGORY + 'get-featured-category-by-id/' + id, {params});
  }


  editFeaturedCategory(data: FeaturedCategory) {
    return this.http.put<{ message: string }>(API_FEATURED_CATEGORY + 'edit-featured-category-by-id', data);
  }

  deleteFeaturedCategoryById(id: string) {
    return this.http.delete<{ message: string }>(API_FEATURED_CATEGORY + 'delete-featured-category-by-id/' + id);
  }

  /**
   * Get No Repeat Data
   */

  getAllFeaturedCategoryNoRepeat(): Observable<{ data: FeaturedCategory[] }> {
    return new Observable((observer) => {
      if (this.allFeaturedCategory.length > 0) {
        observer.next({data: this.allFeaturedCategory});
        observer.complete();
      } else {
        this.http.get<{ data: FeaturedCategory[] }>(API_FEATURED_CATEGORY + 'get-all-featured-category-list')
          .subscribe((res) => {
            this.allFeaturedCategory = res.data;
            observer.next({data: this.allFeaturedCategory});
            observer.complete();
          }, error => {
            console.log(error);
          });
      }
    });
  }



}
