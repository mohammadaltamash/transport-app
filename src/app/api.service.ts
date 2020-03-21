import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';

import { throwError, Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

import { Order } from './model/order';

import { environment } from '../environments/environment';
import { JwtService } from './service/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  accessToken = this.jwtService.accessToken;
  options = this.jwtService.loggedIn
    ? {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
          // 'Access-Control-Allow-Origin': 'http://localhost:4200/'
        })
      }
    : {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };

  constructor(private httpClient: HttpClient, private jwtService: JwtService) {}

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

  public postOrder(order: Order): Observable<Order> {
    console.log('============== inside postOrder');
    return this.httpClient
      .post<Order>(environment.REST_SERVICE + '/order/create', order, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      })
      .pipe(catchError(this.handleError));
  }

  public getOrders() {
    return this.httpClient
      .get<Order[]>(environment.REST_SERVICE + '/order/get', {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.accessToken}`
          // 'Access-Control-Allow-Origin': 'http://localhost:4200/'
        })
      })
      .pipe(retry(3), catchError(this.handleError));
    // return this.httpClient.get('http://245d10bc.ngrok.io/transportapp/demo/order/get');
    // return this.httpClient.get('https://restcountries.eu/rest/v2/all');
  }

  public getOrdersByStatus(status: string) {
    return this.httpClient
      .get<Order[]>(environment.REST_SERVICE + '/order/get/status/' + status, this.options)
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrdersByStatusIn(statuses: string) {
    return this.httpClient
      .get<Order[]>(
        environment.REST_SERVICE + '/order/get/statusin/' + statuses, this.options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrdersCountByStatus(status: string) {
    return this.httpClient
      .get<number>(
        environment.REST_SERVICE + '/order/get/statuscount/' + status, this.options
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getPagedOrders() {
    // const options = { params: new HttpParams({fromString: 'page=0'}) };
    return this.httpClient
      .get<Order[]>(environment.REST_SERVICE + '/order/getpage/1')
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrderById(id: string) {
    return this.httpClient
      .get<Order>(environment.REST_SERVICE + '/order/getpage/1' + id)
      .pipe(retry(3), catchError(this.handleError));
  }

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

  // public postOrder(orderData) {
  //   // alert(orderData.pickupContactName);
  //   this.httpClient.post<any>('http://localhost:8080/transportapp/demo/order/create', orderData).subscribe(
  //     (res) => console.log(res),
  //     (err) => console.log(err)
  //   );
  // }

  // public postOrder() {
  //   this.httpClient.post('http://localhost:8080/transportapp/demo/order/create');
  // }

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
