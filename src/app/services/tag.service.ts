import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ProductTag} from '../interfaces/product-tag';
import {Pagination} from '../interfaces/pagination';
import {ProductAttribute} from '../interfaces/product-attribute';
// import {ProductCategory} from "../interfaces/product-category";


const API_TAG = environment.apiBaseLink + '/api/tag/';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * TAG
   */
  addTag(data: ProductTag) {
    return this.httpClient.post<{ message: string }>(API_TAG + 'add-single-tag', data);
  }

  insertManyTag(data: ProductTag[]) {
    return this.httpClient.post<{message: string}>(API_TAG + 'add-multiple-tag', data);
  }


  getAllTags(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: ProductTag[], message?: string, count: number }>(API_TAG + 'get-all-tags', {params});
    } else {
      return this.httpClient.get<{ data: ProductTag[], message?: string, count: number }>(API_TAG + 'get-all-tags');
    }

  }


  getTagByTagId(id: string) {
    return this.httpClient.get<{ data: ProductTag, message?: string }>(API_TAG + 'get-tag-by-tag-id/' + id);
  }

  getTagByTagSlug(slug: string) {
    return this.httpClient.get<{ data: ProductTag, message?: string }>(API_TAG + 'get-tag-by-tag-slug/' + slug);
  }


  editTagData(data: ProductTag) {
    return this.httpClient.put<{message?: string}>(API_TAG + 'edit-tag-by-tag', data);
  }

  deleteTag(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_TAG + 'delete-tag-by-id/' + id);
  }


  getSearchTag(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: ProductTag[], count: number }>(API_TAG + 'get-tags-by-search', paginate, {params});
  }

  // router.post('/get-tags-by-search', controller.getTagsBySearch);



}
