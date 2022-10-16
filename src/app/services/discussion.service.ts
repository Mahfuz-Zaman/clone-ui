import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

import {Pagination} from '../interfaces/pagination';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Discussion} from '../interfaces/discussion';

const API_DISCUSSION = environment.apiBaseLink + '/api/discussion/';


@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * Discussion Control
   */

  addDiscussion(data: Discussion) {
    return this.httpClient.post<{ message: string }>(API_DISCUSSION + 'add-discussion', data);
  }

  addDiscussionReplyLv1(data: any) {
    return this.httpClient.post<{ message: string }>(API_DISCUSSION + 'add-discussion-reply-lv1', data);
  }

  addDiscussionReplyLv2(data: any) {
    return this.httpClient.post<{ message: string }>(API_DISCUSSION + 'add-discussion-reply-lv2', data);
  }


  getAllDiscussions(pagination?: Pagination) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
    }
    return this.httpClient.get<{ data: Discussion[], count?: number }>(API_DISCUSSION + 'get-all-discussion', {params});
  }

  getDiscussionByDiscussionId(id: string) {
    return this.httpClient.get<{ data: Discussion, message?: string }>(API_DISCUSSION + 'get-discussion-by-discussion-id/' + id);
  }

  editDiscussion(data: Discussion) {
    return this.httpClient.put<{ message: string }>(API_DISCUSSION + 'edit-discussion', data);
  }

  deleteDiscussionByDiscussionId(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_DISCUSSION + 'delete-discussion-by-id/' + id);
  }

  getAllDiscussionsByQuery(pagination?: Pagination, select?: string, query?: any) {
    let params = new HttpParams();

    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
    }
    if (select) {
      params = params.append('select', select);
    }
    return this.httpClient.post<{ data: Discussion[], count: number, message?: string }>
    (API_DISCUSSION + 'get-all-discussion-by-query', {query}, {params});
  }

}
