import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { Product } from '../interfaces/product';
import {Pagination} from '../interfaces/pagination';
import {ImageGallery} from '../interfaces/image-gallery';
import {ProductFilter} from '../interfaces/product-filter';
import {ProductSubCategory} from '../interfaces/product-sub-category';
import {UiService} from "./ui.service";

const API_PRODUCT = environment.apiBaseLink + '/api/product/';


@Injectable({
  providedIn: 'root'
})
export class ProductService {


  constructor(
    private http: HttpClient,
    private uiService: UiService
  ) {
  }

  /**
   * PRODUCT
   */

  addSingleProduct(data: any) {
    return this.http.post<{ message: string }>(API_PRODUCT + 'add-single-product', data);
  }

  insertManyProduct(data: any[]) {
    return this.http.post<{ message: string }>(API_PRODUCT + 'add-multiple-products', data);
  }

  updateMultipleProductById(data: any[]) {

    return this.http.post<{ message: string }>(API_PRODUCT + 'update-multiple-product-by-id', data);
  }


  getAllProducts(paginate: Pagination, filter?: ProductFilter) {
    return this.http.post<{ data: Product[], priceRange: any, count: number, message: string }>(API_PRODUCT + 'get-all-products', {paginate, filter});
  }
  getProductsByTagId(pagination, id: string) {
    let params = new HttpParams();

    console.log('checking Id',id)

    if(pagination){
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.http.get<{ data: Product[], message?: string, count: number}>(API_PRODUCT + 'get-products-by-tag-id/' + id, {params});
  }

  getProductsByDynamicSort(paginate: Pagination, sort: any, filter?: ProductFilter, select?: string) {
    return this.http.post<{ data: Product[], priceRange: any, count: number}>(API_PRODUCT + 'get-products-by-dynamic-sort', {paginate, sort, filter, select});
  }


  getSingleProductBySlug(slug: string) {
    return this.http.get<{ data: any, message: string }>(API_PRODUCT + 'get-single-product-by-slug/' + slug);
  }

  getSingleProductById(id: string) {
    return this.http.get<{ data: any, message: string }>(API_PRODUCT + 'get-single-product-by-id/' + id);
  }

  editProductById(data: any) {
    return this.http.put<{ message: string }>(API_PRODUCT + 'edit-product-by-id', data);
  }

  deleteProductById(id: string) {
    return this.http.delete<{ message: string }>(API_PRODUCT + 'delete-product-by-id/' + id);
  }

  getRelatedProducts(data: any) {
    return this.http.get<{ data: any, message: string }>(API_PRODUCT + 'get-related-products/' + data.category + '/' + data.subCategory + '/' + data.id);
  }

  getRecommendedProducts(ids: any) {
    return this.http.post<{ data: any, message: string }>(API_PRODUCT + 'get-recommended-products/', {data: ids});
  }

  productFilterByQuery(query: any, paginate?: any, select?: any) {
    const data = {
      query,
      paginate,
      select
    };
    return this.http.post<{ data: Product[], priceRange: any, count: number, message: string }>(API_PRODUCT + 'product-filter-query', data);
  }

  getSearchProduct(searchTerm: string, pagination?: Pagination, filter?: any) {

    let params = new HttpParams();
    params = params.append('q', searchTerm);
    if (pagination) {
      params = params.append('pageSize', pagination.pageSize);
      params = params.append('currentPage', pagination.currentPage);
    }
    return this.http.post<{ data: Product[], count: number }>(API_PRODUCT + 'get-products-by-search', {filter}, {params});
  }


  getSpecificProductsById(ids: string[], select?: string) {
    return this.http.post<{ data: Product[] }>(API_PRODUCT + 'get-specific-products-by-ids', {ids, select});
  }

  /**
   * COMPARE LIST with LOCAL STORAGE
   */

  addToCompare(productId: string, categoryId?: string) {
    // console.log(product);
    const items = JSON.parse(localStorage.getItem('compareListV2'));
    let compareListV2;
    if (items === null) {
      compareListV2 = [];
      compareListV2.push({_id: productId, category: categoryId});
      this.uiService.success('Product added to compare list');
    } else {
      compareListV2 = items;
      const fIndex = compareListV2.findIndex((o) => o._id === productId);
      const fIndexCat = compareListV2.findIndex((o) => o.category === categoryId);
      if (fIndex === -1) {
        if (compareListV2.length !== 3) {
          if (fIndexCat === -1) {
            this.uiService.wrong('Please add same category product to compare');
          } else {
            compareListV2.push({_id: productId, category: categoryId});
            this.uiService.success('Product added to compare list');
          }

        }
        else {
          this.uiService.wrong('Your compare list is full');
        }
      } else {
        this.uiService.warn('This product already in compare list');
      }
    }
    localStorage.setItem('compareListV2', JSON.stringify(compareListV2));
  }


  getCompareList(): string[] {
    const list = localStorage.getItem('compareListV2');
    if (list === null) {
      return [];
    }
    return JSON.parse(list) as any[];
  }

  deleteCompareItem(id: string) {
    const items = JSON.parse(localStorage.getItem('compareListV2'));
    const filtered = items.filter(el => el._id !== id);
    if (filtered && filtered.length){
      localStorage.setItem('compareListV2', JSON.stringify(filtered));
    } else {
      localStorage.removeItem('compareListV2');
    }
  }
}
