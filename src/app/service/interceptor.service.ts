import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class InterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (localStorage.getItem('access_token')) {
        const reqUrl = environment.REST_SERVICE_URL;
        req = req.clone({
        headers: req.headers.set(
            'Authorization',
            'Bearer ' + localStorage.getItem('access_token')
        )
        // url: reqUrl + '' + req.url
        });
    }
    return next.handle(req);
  }
}
