import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {InstallationRepair} from '../interfaces/installation-repair';

const API_INSTALLATION_AND_REPAIR = environment.apiBaseLink + '/api/installation-and-repair/';

@Injectable({
  providedIn: 'root'
})
export class InstallationRepairService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewInstallationRepair(data: InstallationRepair) {
    return this.http.post<{ message: string }>(API_INSTALLATION_AND_REPAIR + 'add-new-installation-and-repair', data);
  }


  getAllInstallationRepair(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.http.get<{ data: InstallationRepair[], count: number, message?: string }>
      (API_INSTALLATION_AND_REPAIR + 'get-all-installation-and-repair-list', {params});
    } else {
      return this.http.get<{ data: InstallationRepair[], count: number, message?: string }>
      (API_INSTALLATION_AND_REPAIR + 'get-all-installation-and-repair-list');
    }
  }

  getSingleInstallationRepairById(id: string, selectProductField?: string) {
    let params = new HttpParams();
    if (selectProductField) {
      params = params.append('select', selectProductField);
    }
    // tslint:disable-next-line:max-line-length
    return this.http.get<{ data: InstallationRepair, message?: string }>(API_INSTALLATION_AND_REPAIR + 'get-installation-and-repair-by-id/' + id, {params});
  }

  getInstallationRepairBySlug(slug: string) {
    return this.http.get<{ data: InstallationRepair[], message: string }>(API_INSTALLATION_AND_REPAIR + 'get-installation-and-repair-by-slug/' + slug);
  }


  editInstallationRepair(data: InstallationRepair) {
    return this.http.put<{ message: string }>(API_INSTALLATION_AND_REPAIR + 'edit-installation-and-repair-by-id', data);
  }

  deleteInstallationRepairById(id: string) {
    return this.http.delete<{ message: string }>(API_INSTALLATION_AND_REPAIR + 'delete-installation-and-repair-by-id/' + id);
  }


}
