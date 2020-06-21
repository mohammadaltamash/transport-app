import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

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

  public getUsersByType(type: string) {
    return this.httpClient
      .get<User[]>(
        environment.REST_SERVICE_URL + '/user/get/type/' + type
        // ,
        // this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getUserByEmail(email: string) {
    return this.httpClient
      .get<User>(
        environment.REST_SERVICE_URL + `/user/get/${email}`
        // ,
        // this.getOptions()
      )
      .pipe(retry(3), catchError(this.handleError));
  }

  public getDriverByCompany(companyName: string) {
    return this.httpClient
      .get<User[]>(
        environment.REST_SERVICE_URL + `/user/get/company/${companyName}`)
      .pipe(retry(3), catchError(this.handleError));
  }

}
