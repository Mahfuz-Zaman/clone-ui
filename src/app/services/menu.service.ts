import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {CategoryMenu} from '../interfaces/category-menu';
import {Observable} from 'rxjs';


const API_CATEGORY_MENU = environment.apiBaseLink + '/api/category-menu/';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private categoryMenu: CategoryMenu[] = [];
  private categoryMenuReqCount = 0;

  constructor(
    private httpClient: HttpClient
  ) {
  }

  /**
   * CATEGORY MENU
   */
  addNewCategoryMenu(data: CategoryMenu) {
    return this.httpClient.post<{ message: string }>(API_CATEGORY_MENU + 'add-new-category-menu', data);
  }

  getAllCategoryMenu() {
    return this.httpClient.get<{ data: CategoryMenu[], message: string }>(API_CATEGORY_MENU + 'get-all-category-menu');
  }

  getCategoryMenuById(id: string) {
    return this.httpClient.get<{ data: CategoryMenu, message: string }>(API_CATEGORY_MENU + 'get-category-menu-by-id/' + id);
  }

  deleteCategoryMenuById(id: string) {
    return this.httpClient.delete<{ message: string }>(API_CATEGORY_MENU + 'delete-category-menu-by-id/' + id);
  }

  updateCategoryMenu(data: CategoryMenu) {
    return this.httpClient.put<{ message: string }>(API_CATEGORY_MENU + 'update-category-menu-item', data);
  }

  /**
   * HTTP NO REPEAT
   */
  getAllCategoryMenuNoRepeat(): Observable<{ data: CategoryMenu[] }> {
    return new Observable((observer) => {
      if (this.categoryMenu && this.categoryMenu.length > 0) {
        observer.next({data: this.categoryMenu});
        observer.complete();
      } else {
        this.httpClient.get<{ data: CategoryMenu[], message: string }>(API_CATEGORY_MENU + 'get-all-category-menu')
          .subscribe((res) => {
            this.categoryMenu = res.data;
            observer.next({data: this.categoryMenu});
            observer.complete();
          }, error => {
            console.log(error);
          });
      }
    });
  }


}
