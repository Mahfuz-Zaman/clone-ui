import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Blog} from '../interfaces/blog';

const API_BLOG = environment.apiBaseLink + '/api/blog/';


@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) {
  }

  /**
   * BRAND
   */
  addBlog(data: Blog) {
    return this.httpClient.post<{message: string}>(API_BLOG + 'add-blog', data);
  }

  getAllBlogs() {
    return this.httpClient.get<{data: Blog[], message?: string}>(API_BLOG + 'get-all-blogs');
  }

  getBlogByBlogID(id: string) {
    return this.httpClient.get<{data: Blog, message?: string}>(API_BLOG + 'get-blog-by-blog-id/' + id);
  }


  getSingleBlogBySlug(slug: string) {
    return this.httpClient.get<{ data: Blog, message: string }>(API_BLOG + 'get-single-blog-by-slug/' + slug);
  }

  editBlogData(data: Blog) {
    return this.httpClient.put<{message?: string}>(API_BLOG + 'edit-blog-by-blog', data);
  }

  deleteBlog(id: string) {
    return this.httpClient.delete<{message?: string}>(API_BLOG + 'delete-blog-by-id/' + id);
  }
}
