import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication.service';
import { Router } from '@angular/router';
import { User } from './model/user';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Order } from './model/order';
import { ApiService } from './service/api.service';
import { OrderStatus } from './model/order-status';
import { Constants } from './model/constants';
import { takeUntil } from 'rxjs/operators';
import { PagedOrders } from './model/paged-orders';
import { UserService } from './service/user.service';
import { environment } from 'src/environments/environment.prod';

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

  private currentOrdersSubject: BehaviorSubject<Order[]>;
  public currentOrders: Observable<Order[]>;

  private currentNewSubject: BehaviorSubject<number>;
  public currentNew: Observable<number>;

  private currentAcceptedSubject: BehaviorSubject<number>;
  public currentAccepted: Observable<number>;

  private currentAssignedSubject: BehaviorSubject<number>;
  public currentAssigned: Observable<number>;

  private selectedDriverSubject: BehaviorSubject<User>;
  public selectedDriver: Observable<User>;

  private driversSubject: BehaviorSubject<User[]>;
  public drivers: Observable<User[]>;

  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private userService: UserService
  ) {
    this.currentOrderSubject = new BehaviorSubject<Order>(null
      // JSON.parse(localStorage.getItem('current_user'))
    );
    this.currentOrder = this.currentOrderSubject.asObservable();

    // this.apiService
    //       .getOrdersByStatusIn(OrderStatus.NEW, null, null, 0, Constants.ORDERS_PER_PAGE)
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe((data: PagedOrders) => {
    //         // this.orders = data.orders;
    //         this.currentOrdersSubject = new BehaviorSubject<Order[]>(
    //           data.orders
    //         );
    //         this.currentOrders = this.currentOrdersSubject.asObservable();
    //       });
    this.currentOrdersSubject = new BehaviorSubject<Order[]>([]);
    this.currentOrders = this.currentOrdersSubject.asObservable();

    // this.apiService
    //       .getOrdersCountByStatus('NEW')
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe((data: number) => {
    //         this.currentNewSubject = new BehaviorSubject<number>(data);
    //         this.currentNew = this.currentNewSubject.asObservable();
    //       });
    this.currentNewSubject = new BehaviorSubject<number>(0);
    this.currentNew = this.currentNewSubject.asObservable();

    this.currentAcceptedSubject = new BehaviorSubject<number>(0);
    this.currentAccepted = this.currentAcceptedSubject.asObservable();

    this.currentAssignedSubject = new BehaviorSubject<number>(0);
    this.currentAssigned = this.currentAssignedSubject.asObservable();

    this.selectedDriverSubject = new BehaviorSubject<User>(null);
    this.selectedDriver = this.selectedDriverSubject.asObservable();

    this.driversSubject = new BehaviorSubject<User[]>([]);
    this.drivers = this.driversSubject.asObservable();
    this.userService
          .getUsersByType(environment.USER_DRIVER)
          // .pipe(takeUntil(this.destroy$))
          .subscribe((users: User[]) => {
            this.setDriversValue(users);
          });

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

  public get currentOrdersValue(): Order[] {
    return this.currentOrdersSubject.value;
  }

  setCurrentOrdersValue(orders: Order[]) {
    this.currentOrdersSubject.next(orders);
  }

  public get currentNewValue(): number {
    return this.currentNewSubject.value;
  }

  setCurrentNewValue(n: number) {
    this.currentNewSubject.next(n);
  }

  public get currentAcceptedValue(): number {
    return this.currentAcceptedSubject.value;
  }

  setCurrentAcceptedValue(n: number) {
    this.currentAcceptedSubject.next(n);
  }

  public get currentAssignedValue(): number {
    return this.currentAssignedSubject.value;
  }

  setCurrentAssignedValue(n: number) {
    this.currentAssignedSubject.next(n);
  }

  public get selectedDriverValue(): User {
    return this.selectedDriverSubject.value;
  }

  setSelectedDriverValue(u: User) {
    this.selectedDriverSubject.next(u);
  }

  public get driverValue(): User[] {
    return this.driversSubject.value;
  }

  setDriversValue(drivers: User[]) {
    this.driversSubject.next(drivers);
  }
}
