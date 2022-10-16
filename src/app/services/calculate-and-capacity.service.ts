import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';


import { Calculate } from '../interfaces/calculation';

const API_USER = environment.apiBaseLink + '/api/user/';


@Injectable({
  providedIn: 'root'
})
export class CalculateCoolingCapacity {


  constructor(
    private httpClient: HttpClient,
  ) {
  }



  editCalculation(calculate: Calculate) {
    return this.httpClient.put<{ message: string }>(API_USER + 'edit-calculation', calculate);
  }










  addCalculation(calculate: Calculate) {
    return this.httpClient.post<{ message: string }>(API_USER + 'add-calculation', calculate);
  }

  deleteCalculate(calculateId: string) {
    return this.httpClient.delete<{ message: string }>(API_USER + 'delete-calculation-by-id/' + calculateId);
  }





}
