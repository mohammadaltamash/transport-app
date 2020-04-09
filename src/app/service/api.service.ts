import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Order } from '../model/order';
import { User } from '../model/user';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../service/authentication.service';
import { AuditResponse } from '../model/audit-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient, private authenticationService: AuthenticationService) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server side errors
      errorMessage = `Error Code: ${error.status}\nMessage: {error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  // getOptions() {
  //   return this.authenticationService.loggedIn
  //     ? {
  //         headers: new HttpHeaders({
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${this.authenticationService.accessToken}`
  //         })
  //       }
  //     : {
  //         headers: new HttpHeaders({
  //           'Content-Type': 'application/json'
  //         })
  //       };
  // }

  // Order

  public postOrder(order: Order): Observable<Order> {
    return this.httpClient
      .post<Order>(
        environment.REST_SERVICE_URL + '/order/create',
        order
        // ,
        // this.getOptions()
      )
      .pipe(catchError(this.handleError));
  }

  public updateOrder(order: Order): Observable<Order> {
    return this.httpClient
      .put<Order>(
        environment.REST_SERVICE_URL + '/order/update',
        order
        // ,
        // this.getOptions()
      )
      .pipe(catchError(this.handleError));
  }

  public getOrders() {
    return this.httpClient
      .get<Order[]>(environment.REST_SERVICE_URL + '/order/get'
      // , this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrdersByStatus(status: string) {
    return this.httpClient
      .get<Order[]>(
        environment.REST_SERVICE_URL + '/order/get/status/' + status
        // ,
        // this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrdersByStatusIn(statuses: string) {
    return this.httpClient
      .get<Order[]>(
        environment.REST_SERVICE_URL + '/order/get/statusin/' + statuses
        // ,
        // this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrdersCountByStatus(status: string) {
    return this.httpClient
      .get<number>(
        environment.REST_SERVICE_URL + '/order/get/statuscount/' + status
        // ,
        // this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getPagedOrders() {
    // const options = { params: new HttpParams({fromString: 'page=0'}) };
    return this.httpClient
      .get<Order[]>(environment.REST_SERVICE_URL + '/order/getpage/1')
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrderById(id: string) {
    return this.httpClient
      .get<Order>(environment.REST_SERVICE_URL + '/order/get/' + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  // User

  public getUserByEmail(email: string) {
    return this.httpClient
      .get<User>(
        environment.REST_SERVICE_URL + `/user/get/${email}`
        // ,
        // this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  // Address

  public verifyAddress(address: string) {
    const params = new HttpParams()
      // .set('auth-id', '47f66a5f-f9f4-be57-fad2-8aa1c1a6c4ad')
      // .set('auth-token', 'aIw6eGhZorEhYLQnQySb')
      .set('key', '30454944820307738')
      .set('street', address);
    return this.httpClient
      .get<any[]>(environment.US_ADDRESS_VALIDATOR_URL, { params })
      .pipe(retry(3), catchError(this.handleError));
  }

  public verifyZip(zipcode: string) {
    const params = new HttpParams()
      // .set('auth-id', '47f66a5f-f9f4-be57-fad2-8aa1c1a6c4ad')
      // .set('auth-token', 'aIw6eGhZorEhYLQnQySb')
      .set('key', '30454944820307738')
      .set('zipcode', zipcode);
    return this.httpClient
      .get<any[]>(environment.US_ZIP_VALIDATOR_URL, { params })
      .pipe(retry(3), catchError(this.handleError));
  }

  // Audit

  public getAudit(clazz: string, id: number) {
    return this.httpClient
      .get<AuditResponse>(environment.REST_SERVICE_URL + `/audit/get/${clazz}/${id}` )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getVehicleYears() {
    const vehicleYears: number[] = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear + 1; i >= 1925; i--) {
      vehicleYears.push(i);
    }
    return vehicleYears;
  }

  public getMakes() {
    return [
      'General Motors',
      'Fiat Chrysler Automobiles',
      'Ford Motor Company'
    ];
  }

  public getModels(make: string) {
    switch (make) {
      case 'General Motors': {
        return ['Buick', 'Cadillac', 'Chevrolet', 'GMC'];
      }
      case 'Fiat Chrysler Automobiles': {
        return ['Chrysler', 'Dodge', 'Jeep', 'RAM'];
      }
      case 'Ford Motor Company': {
        return ['Ford', 'Lincoln Motor Company'];
      }
    }
    return [];
  }
}
