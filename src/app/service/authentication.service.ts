import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, catchError, retry } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private httpClient: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('current_user'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

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
    return this.httpClient
      .post<User>(
        environment.REST_SERVICE_URL + '/login',
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
        tap(user => {
          localStorage.setItem('access_token', user.jwtToken);
          localStorage.setItem('current_user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
    // .pipe(
    //       catchError(this.handleError)
    //     );
  }

  register(user: User) {
    return this.httpClient
      .post<boolean>(environment.REST_SERVICE_URL + '/register', user)
      .pipe(
        tap(res => {
          // this.login(user.email, user.password);
          console.log(res);
        })
      );
  }

  logout() {
    let loggedin = this.loggedIn;
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    this.currentUserSubject.next(null);
    loggedin = this.loggedIn;
    console.log(loggedin);
  }

  public get loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  public get accessToken(): string {
    return localStorage.getItem('access_token');
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }
}
