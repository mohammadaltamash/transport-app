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
import { OrderCarrier } from '../model/order-carrier';
import { PagedOrders } from '../model/paged-orders';
import { CityZipLatLong } from '../model/city-zip-lat-long';
import { LatitudeLongitudeDistance } from '../model/latitude-longitude-distance';
import { LatitudeLongitudeDistanceRefs } from '../model/latitude-longitude-distance-refs';
import { Preferences } from '../model/preferences';

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

  // public getOrderCarrier(id: string) {
  //   return this.httpClient
  //     .get<OrderCarrier>(environment.REST_SERVICE_URL + '/ordercarrier/${orderId}'
  //     // , this.getOptions()
  //     )
  //     .pipe(retry(3), catchError(this.handleError));
  // }

  public bookOrder(orderId: number, carrierId: number, orderCarrier: OrderCarrier): Observable<OrderCarrier> {
    return this.httpClient
      .put<OrderCarrier>(
        environment.REST_SERVICE_URL + `/order/bookingrequest/book/${orderId}/${carrierId}`,
        orderCarrier
        // ,
        // this.getOptions()
      )
      .pipe(catchError(this.handleError));
  }

  public acceptOrDecline(orderId: number, orderCarrierId: number, acceptOrDecline: string): Observable<OrderCarrier> {
    return this.httpClient
      .put<OrderCarrier>(
        environment.REST_SERVICE_URL + `/order/bookingrequest/${orderId}/${orderCarrierId}/${acceptOrDecline}`,
        null
      )
      .pipe(catchError(this.handleError));
  }

  public assignDriver(driverId: number, orderId: number): Observable<Order> {
    return this.httpClient
      .put<Order>(
        environment.REST_SERVICE_URL + `/order/assigndriver/${driverId}/${orderId}`,
        null
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

  public getOrdersByStatusIn(statuses: string, primarySort: string, secondarySort: string, page: number, pageSize: number) {
    return this.httpClient
      .get<PagedOrders>(
        environment.REST_SERVICE_URL + `/order/get/statusin/${statuses}/${primarySort}/${secondarySort}/${page}/${pageSize}`
        // ,
        // this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  // public getOrdersByStatesIn(pickupStates: string, deliveryStates: string, statuses: string, page: number, pageSize: number) {
  //   return this.httpClient
  //     .get<PagedOrders>(
  //       environment.REST_SERVICE_URL + `/order/get/statesin//${pickupStates}${deliveryStates}/${statuses}/${page}/${pageSize}`
  //       // ,
  //       // this.getOptions()
  //     )
  //     .pipe(retry(3), catchError(this.handleError));
  // }

  public getOrdersCount() {
    return this.httpClient
      .get<number>(
        environment.REST_SERVICE_URL + '/order/count'
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

  public getPagedOrders(page: number, pageSize: number) {
    // const options = { params: new HttpParams({fromString: 'page=0'}) };
    return this.httpClient
      .get<PagedOrders>(environment.REST_SERVICE_URL + `/order/getpage/${page}/${pageSize}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  public getOrderById(id: string) {
    return this.httpClient
      .get<Order>(environment.REST_SERVICE_URL + '/order/get/' + id)
      .pipe(retry(3), catchError(this.handleError));
  }

  public searchOrders(statuses: string, searchText: string, page: number, pageSize: number) {
    return this.httpClient
      .get<PagedOrders>(environment.REST_SERVICE_URL + `/order/search/${statuses}/${searchText}/${page}/${pageSize}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  public getFilteredOrders(latitudeLongitudeRefs: LatitudeLongitudeDistanceRefs, originStatesCsv: string, destinationStatesCsv: string,
                           primarySort: string, secondarySort: string,
                           fieldEqualToJson: {},
                           fieldGreaterThanEqualJson: {},
                           page: number, pageSize: number) {
    const latitudeLongitudeList = encodeURIComponent(JSON.stringify(latitudeLongitudeRefs));
    // const fieldEqualTo = encodeURIComponent(JSON.stringify(Array.from(fieldEqualToMap.entries())));
    // const fieldGreaterThanEqual = encodeURIComponent(JSON.stringify(Array.from(fieldGreaterThanEqualToMap.entries())));
    const fieldEqualTo = encodeURIComponent(JSON.stringify(fieldEqualToJson));
    const fieldGreaterThanEqual = encodeURIComponent(JSON.stringify(fieldGreaterThanEqualJson));
    return this.httpClient
      .get<PagedOrders>(environment.REST_SERVICE_URL
          + `/order/getfilteredorders/${originStatesCsv}/${destinationStatesCsv}/${primarySort}/${secondarySort}`
          + `/${page}/${pageSize}/?refs=${latitudeLongitudeList}`
          + `&fieldequalto=${fieldEqualTo}&fieldgreaterthanequalto=${fieldGreaterThanEqual}`)
      .pipe(retry(3), catchError(this.handleError));
  }

  // public getCircularDistanceBoth(pickupLatitude: number, pickupLongitude: number, deliveryLatitude: number, deliveryLongitude: number,
  //                                distance: number, page: number, pageSize: number) {
  //   return this.httpClient
  //     .get<PagedOrders>(environment.REST_SERVICE_URL
  //         + `/order/getinradius/${pickupLatitude}/${pickupLongitude}/${deliveryLatitude}/${deliveryLongitude}/
  //         ${distance}/${page}/${pageSize}`)
  //     .pipe(retry(3), catchError(this.handleError));
  // }

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

  // Order Carrier
  // Order request from carrier
  public createOrderRequest(orderCarrier: OrderCarrier, orderId: number, email: string): Observable<OrderCarrier> {
    return this.httpClient
      .post<OrderCarrier>(
        environment.REST_SERVICE_URL + `/order/bookingrequest/${orderId}/${email}`, orderCarrier
        // ,
        // this.getOptions()
      )
      .pipe(catchError(this.handleError));
  }

  public getOrderCarrier(id: number) {
    return this.httpClient
      .get<OrderCarrier>(environment.REST_SERVICE_URL + `/order/ordercarrier/${id}`
      // , this.getOptions()
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
      .get<AuditResponse[]>(environment.REST_SERVICE_URL + `/audit/get/${clazz}/${id}` )
      .pipe(retry(3), catchError(this.handleError));
  }

  // CityZipLatLong

  public getCityZipLatLong(text: string) {
    return this.httpClient
      .get<CityZipLatLong[]>(environment.REST_SERVICE_URL + `/location/${text}` )
      .pipe(retry(3), catchError(this.handleError));
  }

  // Preferences
  public updatePreferences(preferences: Preferences): Observable<Preferences> {
    return this.httpClient
      .put<Preferences>(
        environment.REST_SERVICE_URL + '/preferences',
        preferences
      )
      .pipe(catchError(this.handleError));
  }

  public getPreferences() {
    return this.httpClient
      .get<Preferences>(environment.REST_SERVICE_URL + '/preferences/get' )
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
      'BMW',
      'Mercedes - Benz',
      'Dodge',
      'Jeep',
      'Ram',
      'Ford',
      'Lincoln',
      'Buick',
      'Cadillac',
      'Chevrolet',
      'GMC',
      'Acura',
      'Honda',
      'Hyundai',
      'Kia',
      'Infiniti',
      'Nissan',
      'Rivian',
      'Subaru',
      'Tesla',
      'Lexus',
      'Toyota',
      'Volkswagen',
      'Volvo'
  ];
  }

  public getModels(make: string) {
    switch (make) {
      case 'BMW': { return ['X3', 'X4', 'X5', 'X6', 'X7'];
        }
        case 'Mercedes - Benz': {
          return ['C-Class', 'GLE-Class', 'GLS-Class'];
        }
        case 'Dodge': {
          return ['Durango'];
        }
        case 'Jeep': {
          return ['Cherokee', 'Gladiator', 'Grand Cherokee', 'Grand Cherokee', 'Wrangler'];
        }
        case 'Ram': {
          return ['1500', '1500 Classic'];
        }
        case 'Ford': {
          return ['Bronco', 'Escape', 'Expedition', 'Expedition MAX', 'Explorer', 'F-150', 'Mustang', 'Ranger', 'Super Duty', 'Transit'];
        }
        case 'Lincoln': {
          return ['Aviator', 'Continental', 'Corsair', 'Navigator'];
        }
        case 'Buick': {
          return ['Enclave'];
        }
        case 'Cadillac': {
          return ['CT4', 'CT5', 'CT6', 'Escalade', 'Escalade ESV', 'XT4', 'XT5', 'XT6'];
        }
        case 'Chevrolet': {
          return ['Bolt', 'Camaro', 'Colorado', 'Corvette', 'Express', 'Malibu', 'Silverado', 'Sonic', 'Suburban', 'Tahoe', 'Traverse'];
        }
        case 'GMC': {
          return ['Acadia', 'Canyon', 'Savana', 'Sierra', 'Yukon', 'Yukon XL'];
        }
        case 'Acura': {
          return ['ILX', 'MDX', 'NSX', 'RDX', 'TLX'];
        }
        case 'Honda': {
          return ['Accord', 'Civic', 'CR-V', 'Insight', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline'];
        }
        case 'Hyundai': {
          return ['Elantra', 'Santa Fe', 'Sonata'];
        }
        case 'Kia': {
          return ['Optima', 'Sorento', 'Telluride'];
        }
        case 'Infiniti': {
          return ['QX60'];
        }
        case 'Nissan': {
          return ['Altima', 'Frontier', 'Leaf', 'Maxima', 'Murano', 'NV', 'Pathfinder', 'Rogue', 'Titan'];
        }
        case 'Rivian': {
          return ['R1S', 'R1T'];
        }
        case 'Subaru': {
          return ['Ascent', 'Impreza', 'Legacy', 'Outback'];
        }
        case 'Tesla': {
          return ['Model 3', 'Model S', 'Model X'];
        }
        case 'Lexus': {
          return ['ES'];
        }
        case 'Toyota': {
          return ['Avalon', 'Camry', 'Corolla', 'Highlander', 'Sequoia', 'Sienna', 'Tacoma', 'Tundra'];
        }
        case 'Volkswagen': {
          return ['Atlas', 'Passat'];
        }
        case 'Volvo': {
          return ['S60'];
        }
    }
    return [];
  }
}
