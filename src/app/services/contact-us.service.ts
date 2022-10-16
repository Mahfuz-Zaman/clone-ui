import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {ContactUs} from '../interfaces/contact-us';
import {Pagination} from '../interfaces/pagination';


const API_CONTACT_US = environment.apiBaseLink + '/api/contact-us/';

@Injectable({
  providedIn: 'root'
})


export class ContactUsService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * Contact US
   */
  addContactUs(data: ContactUs) {
    return this.httpClient.post<{ message: string }>(API_CONTACT_US + 'add-contact-us', data);
  }

  addSubmitComplaint(data: any) {
    return this.httpClient.post<{ message: string }>(API_CONTACT_US + 'add-submit-complaint', data);
  }

  addAfterSaleSupport(data: any) {
    return this.httpClient.post<{ message: string }>(API_CONTACT_US + 'add-after-sale-support', data);
  }



  getAllContactUs(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: ContactUs[], count: number, message?: string }>(API_CONTACT_US + 'get-all-contact-us', {params});
    } else {
      return this.httpClient.get<{ data: ContactUs[], count: number, message?: string }>(API_CONTACT_US + 'get-all-contact-us');
    }
  }


  getContactUsById(id: string) {
    return this.httpClient.get<{ data: ContactUs, message?: string }>(API_CONTACT_US + 'get-contact-us-by-id/' + id);
  }

  editContactUs(data: ContactUs) {
    return this.httpClient.put<{ message: string }>(API_CONTACT_US + 'edit-contact-us-by-id', data);
  }


  deleteContactUsById(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_CONTACT_US + 'delete-contact-us-by-id/' + id);
  }


}
