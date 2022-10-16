import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Pagination} from '../interfaces/pagination';
import {CertificateVerification} from '../interfaces/certificate-verification';
import {Blog} from '../interfaces/blog';


const API_CERTIFICATE = environment.apiBaseLink + '/api/certificates/';

@Injectable({
  providedIn: 'root'
})
export class CertificateVerificationService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * WARRANTY
   */
  addCertificate(data: CertificateVerification) {
    return this.httpClient.post<{ message: string }>(API_CERTIFICATE + 'add-single-certificate', data);
  }

  getCertificateDataByCustomer(data: {customerPhoneNo: string; select: string;}) {
    return this.httpClient.post<{ data: CertificateVerification[], success: boolean, count: number }>(API_CERTIFICATE + 'get-certificate-data-by-customer', data);
  }

  checkCertificateByCustomerPhoneNo(data: {customerPhoneNo: string}) {
    return this.httpClient.post<{ success: boolean }>(API_CERTIFICATE + 'check-certificate-data-by-customer-phone-no', data);
  }


  getCertificateByCertificateId(id: string) {
    return this.httpClient.get<{ data: CertificateVerification, message?: string }>(API_CERTIFICATE + 'get-certificate-by-certificate-id/' + id);
  }

  trackCertificateDownloadHistory(id: string) {
    return this.httpClient.post<{ success: boolean }>(API_CERTIFICATE + 'track-certificate-download-history', {_id: id});
  }


  insertManyCertificate(data: CertificateVerification[]) {
    return this.httpClient.post<{message: string}>(API_CERTIFICATE + 'add-multiple-certificate', data);
    // return this.httpClient.put<{ message: string }>(API_CERTIFICATE + 'update-multiple-certificate-by-id', data);
  }

  getAllCertificatesByAdminNoPaginate() {
    return this.httpClient.get<{ data: CertificateVerification[]}>(API_CERTIFICATE + 'get-all-certificate-by-admin-no-paginate');
}
  getMultipleCertificatesByAdmin(orderids: string[]){
    return this.httpClient.post<{ data: CertificateVerification[], count: number}>(API_CERTIFICATE + 'get-multiple-certificate-by-id', orderids);
  }

  getAllCertificates(pagination?: Pagination) {
    if (pagination) {
      let params = new HttpParams();
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('page', pagination.currentPage);
      return this.httpClient.get<{ data: CertificateVerification[], message?: string, count: number }>(API_CERTIFICATE + 'get-all-certificates', {params});
    } else {
      return this.httpClient.get<{ data: CertificateVerification[], message?: string, count: number }>(API_CERTIFICATE + 'get-all-certificates');
    }

  }


  getSingleCertificateBycertificateNumber(certificateNumber: string) {
    return this.httpClient.get<{ data: CertificateVerification, message: string }>(API_CERTIFICATE + 'get-certificate-by-certificate-number/' + certificateNumber);
  }

  editCertificateData(data: CertificateVerification) {
    return this.httpClient.put<{message?: string}>(API_CERTIFICATE + 'edit-certificate-by-certificate', data);
  }

  deleteCertificate(id: string) {
    return this.httpClient.delete<{ message?: string }>(API_CERTIFICATE + 'delete-certificate-by-id/' + id);
  }


  getSearchCertificate(searchTerm: string, pagination?: Pagination) {
    const paginate = pagination;
    let params = new HttpParams();
    params = params.append('q', searchTerm);
    params = params.append('pageSize', pagination.pageSize);
    params = params.append('currentPage', pagination.currentPage);
    return this.httpClient.post<{ data: CertificateVerification[], count: number }>(API_CERTIFICATE + 'get-certificate-by-search', paginate, {params});
  }



}
