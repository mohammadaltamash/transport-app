import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  constructor(private httpClient: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  login(email: string, password: string) {
    // return this.httpClient
    //   .post<{ token: string }>(environment.REST_SERVICE + '/login', {
    //     email,
    //     password
    //   },
    //   {
    //     headers: new HttpHeaders({
    //       'Content-Type': 'application/json'
    //     }),
    //     observe: 'response'
    //   })
    //   .pipe(
    //     // catchError(this.handleError)
    //   );

    return this.httpClient
      .post<any>(
        environment.REST_SERVICE + '/login',
        {
          email: `${email}`,
          password: `${password}`
        },
        {
          headers: new HttpHeaders({
            'Content-Type': 'application/json'
            // 'Access-Control-Allow-Origin': 'http://localhost:4200/'
          })
        }
      )
      .pipe(
        tap(res => {
          localStorage.setItem('access_token', res.token);
        })
      );
      // .pipe(
      //       catchError(this.handleError)
      //     );
  }

  register(email: string, password: string) {
    return this.httpClient
      .post<{ token: string }>(environment.REST_SERVICE + '/register', {
        email,
        password
      })
      .pipe(
        tap(res => {
          this.login(email, password);
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  public get accessToken(): string {
    return localStorage.getItem('access_token');
  }
}
