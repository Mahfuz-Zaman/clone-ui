import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductCategory} from '../interfaces/product-category';
import {Pagination} from '../interfaces/pagination';
import {Observable} from 'rxjs';


const API_CATEGORY = environment.apiBaseLink + '/api/product-category/';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  categories: ProductCategory[] = [];

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * CATEGORY
   */

  addCategory(data: ProductCategory) {
    return this.httpClient.post<{ message: string }>(API_CATEGORY + 'add-category', data);
  }

  insertManyCategory(data: ProductCategory[]) {
    return this.httpClient.post<{ message: string }>(API_CATEGORY + 'add-multiple-category', data);
  }

  getAllCategory(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: ProductCategory[], message?: string, count: number }>(API_CATEGORY + 'get-all-categories', {params});
    } else {
      return this.httpClient.get<{ data: ProductCategory[], message?: string, count: number }>(API_CATEGORY + 'get-all-categories');
    }

  }

  getCategoryByCategoryId(id: string) {
    return this.httpClient.get<{ data: ProductCategory, message?: string }>(API_CATEGORY + 'get-category-by-category-id/' + id);
  }

  editCategoryData(data: ProductCategory) {
    return this.httpClient.put<{ message: string }>(API_CATEGORY + 'edit-category-by-category', data);
  }

  getCategoryBySearch(id: string) {
    return this.httpClient.get<{ data: ProductCategory, message?: string }>(API_CATEGORY + 'get-category-by-search/' + id);
  }

  deleteCategory(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_CATEGORY + 'delete-category-by-id/' + id);
  }

  getCategoryByCategorySlug(slug: string) {
    return this.httpClient.get<{ data: ProductCategory, message?: string }>(API_CATEGORY + 'get-category-by-category-slug/' + slug);
  }

  getBrandByBrandSlug(slug: string) {
    return this.httpClient.get<{ data: ProductCategory, message?: string }>(API_CATEGORY + 'get-category-by-category-slug/' + slug);
  }

  getSearchCategories(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: ProductCategory[], count: number }>(API_CATEGORY + 'get-categories-by-search', paginate, {params});
  }


  /**
   * Get No Repeat Data
   */

  getAllCategoryNoRepeat(select?: string): Observable<{ data: ProductCategory[] }> {
    return new Observable((observer) => {
      if (this.categories.length > 0) {
        observer.next({data: this.categories});
        observer.complete();
      } else {
        let params = new HttpParams();
        if (select) {
          params = params.append('select', select);
        }
        this.httpClient.get<{ data: ProductCategory[] }>(API_CATEGORY + 'get-all-categories', {params})
          .subscribe((res) => {
            this.categories = res.data;
            observer.next({data: this.categories});
            observer.complete();
          }, error => {
            console.log(error);
          });
      }
    });
  }


}
