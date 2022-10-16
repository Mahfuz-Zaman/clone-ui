import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AdminRoleData} from '../interfaces/admin-role-data';
import {StorageService} from './storage.service';


const API_ADMIN = environment.apiBaseLink + '/api/admin/';

@Injectable({
  providedIn: 'root'
})
export class StoredDataService {

  private adminRoleData?: AdminRoleData;


  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService,
  ) {
  }


  /**
   * Get Logged In Admin Role
   */
  // getLoginAdminRole(): Observable<{ data: AdminRoleData }> {
  //   return new Observable((observer) => {
  //     if (this.adminRoleData) {
  //       observer.next({data: this.adminRoleData});
  //       observer.complete();
  //     } else {
  //       this.httpClient.get<{ data: AdminRoleData }>(API_ADMIN + 'get-logged-in-admin-role').subscribe((res) => {
  //         this.adminRoleData = res.data;
  //         this.storageService.storeAdminRole(this.adminRoleData);
  //         observer.next({data: this.adminRoleData});
  //         observer.complete();
  //       }, error => {
  //         console.log(error);
  //       });
  //     }
  //
  //   });
  // }

  /**
   * CHECK ACCESS
   */

  // checkRoleAccess(currentPage: string): boolean {
  //   const roleData = this.storageService.adminRoleFromLocal;
  //   let hasAccess = false;
  //   let i;
  //   for (i = 0; i < roleData.access.length; i++) {
  //     if (roleData.access[i].page === currentPage) {
  //       hasAccess = true;
  //       break;
  //     }
  //   }
  //   return hasAccess;
  // }


  /**
   * ALL CAROUSEL
   */
  // getAllCarousel(): Observable<{ data: Carousel[] }> {
  //   return new Observable((observer) => {
  //     if (this.carousel) {
  //       observer.next(this.carousel);
  //       observer.complete();
  //     } else {
  //       this.http.get<{ data: Carousel[] }>(API_URL_SHOP + 'get-all-carousel').subscribe(res => {
  //         this.carousel = res;
  //         observer.next(this.carousel);
  //         observer.complete();
  //       }, error => {
  //         console.log(error);
  //       });
  //     }
  //
  //   });
  // }


}
