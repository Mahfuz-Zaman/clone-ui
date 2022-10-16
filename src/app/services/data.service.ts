import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Admin} from '../interfaces/admin';

const API_URL_ADMIN = environment.apiBaseLink + '/api/admin/';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * ADMINS
   */
  adminSignUp(data: Admin) {
    return this.http.post<{ message: string }>(API_URL_ADMIN + 'registration', data);
  }

  getAdminLists() {
    return this.http.get<{ data: Admin[], message: string }>(API_URL_ADMIN + 'get-all-admin-list');
  }

  getSingleAdminById(id: string) {
    return this.http.get<{ data: Admin, message?: string }>(API_URL_ADMIN + 'get-single-admin-by-id/' + id);
  }


  deleteAdminById(id: string) {
    return this.http.delete<{ message: string }>(API_URL_ADMIN + 'delete-admin-by-id/' + id);
  }

  editAdmin(data: Admin) {
    return this.http.post<{ message: string }>(API_URL_ADMIN + 'edit-admin-data', data);
  }

  updateAdminImageField(id: string, query: object) {
    return this.http.post<{ message: string }>(API_URL_ADMIN + 'update-admin-images', {id, query});
  }


}
