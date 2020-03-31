import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { Router } from '@angular/router';
import { User } from './model/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from './model/order';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'transport-app-client';
  currentUser: User;
  private currentOrderSubject: BehaviorSubject<Order>;
  public currentOrder: Observable<Order>;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentOrderSubject = new BehaviorSubject<Order>(null
      // JSON.parse(localStorage.getItem('current_user'))
    );
    this.currentOrder = this.currentOrderSubject.asObservable();

    this.authenticationService.currentUser.subscribe(
      u => this.currentUser = u
    );
  }

  loggedIn() {
    return this.authenticationService.loggedIn;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  public get currentOrderValue(): Order {
    return this.currentOrderSubject.value;
  }

  setCurrentOrderValue(order: Order) {
    this.currentOrderSubject.next(order);
  }
}
