import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Pagination} from '../interfaces/pagination';
import {InstallationRepairType} from '../interfaces/installation-repair-type';

const API_INSTALLATION_AND_REPAIR_TYPE = environment.apiBaseLink + '/api/installation-and-repair-type/';

@Injectable({
  providedIn: 'root'
})
export class InstallationRepairTypeService {

  constructor(
    private http: HttpClient,
  ) {
  }

  /**
   * Image Folder
   */

  addNewInstallationRepairType(data: InstallationRepairType) {
    return this.http.post<{ message: string }>(API_INSTALLATION_AND_REPAIR_TYPE + 'add-new-installation-and-repair-type', data);
  }

  addNewInstallationRepairTypeMulti(data: InstallationRepairType[]) {
    return this.http.post<{ message: string }>(API_INSTALLATION_AND_REPAIR_TYPE + 'add-new-installation-and-repair-type-multi', {data});
  }

  getAllInstallationRepairType(pagination?: Pagination, select?: string) {
    let params = new HttpParams();
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      if (select) {
        params = params.append('select', select);
      }
      return this.http.get<{ data: InstallationRepairType[], count: number, message?: string }>
      (API_INSTALLATION_AND_REPAIR_TYPE + 'get-all-installation-and-repair-type-list', {params});
    } else {
      if (select) {
        params = params.append('select', select);
      }
      return this.http.get<{ data: InstallationRepairType[], count: number, message?: string }>
      (API_INSTALLATION_AND_REPAIR_TYPE + 'get-all-installation-and-repair-type-list', {params});
    }
  }


  editInstallationRepairTypeData(data: InstallationRepairType) {
    return this.http.put<{ message: string }>(API_INSTALLATION_AND_REPAIR_TYPE + 'edit-installation-and-repair-type-by-id', data);
  }

  deleteInstallationRepairTypeById(id: string) {
    return this.http.delete<{ message: string }>(API_INSTALLATION_AND_REPAIR_TYPE + 'delete-installation-and-repair-type-by-id/' + id);
  }

  getSingleInstallationRepairTypeById(id: string) {
    return this.http.get<{ data: InstallationRepairType, message?: string }>(API_INSTALLATION_AND_REPAIR_TYPE + 'get-installation-and-repair-type-details-by-id/' + id);
  }

  getSingleInstallationRepairTypeBySlug(slug: string) {
    return this.http.get<{ data: InstallationRepairType, message?: string }>(API_INSTALLATION_AND_REPAIR_TYPE + 'get-installation-and-repair-type-details-by-slug/' + slug);
  }

}
