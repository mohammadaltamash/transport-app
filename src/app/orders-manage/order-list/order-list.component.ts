import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { JwtService } from '../../service/jwt.service';
import { Order } from '../../model/order';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  all = 0;
  new = 0;
  accepted = 0;
  assigned = 0;
  pickedup = 0;
  delivered = 0;

  stepAll = true;
  stepNew = false;
  stepAccepted = false;
  stepAssigned = false;
  stepPickedup = false;
  stepDelivered = false;

  orders: Order[] = [];
  // allOrders: Order[] = [];
  newOrders: Order[] = [];
  acceptedOrders: Order[] = [];
  assignedOrders: Order[] = [];
  pickedupOrders: Order[] = [];
  deliveredOrders: Order[] = [];
  selectedOrder: Order;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService, private jwtService: JwtService) {}

  ngOnInit() {
    // this.apiService
    //   .getOrders()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any[]) => {
    //     this.all = data.length;
    //     console.log(data);
    //     this.allOrders = data;
    //     this.orders = this.allOrders;
    //     if (data.length > 0) {
    //       this.selectedOrder = this.orders[0];
    //     }
    //   });

    this.getOrdersByStatus();
    // this.apiService
    //   .getOrdersByStatus(environment.NEW_ORDER)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any[]) => {
    //     this.new = data.length;
    //     console.log(data);
    //     this.newOrders = data;
    //   });
    // this.apiService
    //   .getOrdersByStatus(environment.ACCEPTED_ORDER)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any[]) => {
    //     this.accepted = data.length;
    //     console.log(data);
    //     this.acceptedOrders = data;
    //   });
    this.setOrdersCountByStatus();
  }

  getClassByStatus(orderStatus: string) {
    if (orderStatus === 'all') {
      return this.getClass(this.stepAll);
    } else if (orderStatus === 'new') {
      return this.getClass(this.stepNew);
    } else if (orderStatus === 'accepted') {
      return this.getClass(this.stepAccepted);
    } else if (orderStatus === 'assigned') {
      return this.getClass(this.stepAssigned);
    } else if (orderStatus === 'pickedup') {
      return this.getClass(this.stepPickedup);
    } else if (orderStatus === 'delivered') {
      return this.getClass(this.stepDelivered);
    }
  }
  getClass(checked: boolean) {
    return checked ? 'ovalButtonChecked' : 'ovalButton';
  }

  onStatusClick(orderStatus: string) {
    if (orderStatus === 'all') {
      if (this.stepAll === false) {
        this.stepAll = true;
        this.stepNew = false;
        this.stepAccepted = false;
        this.stepAssigned = false;
        this.stepPickedup = false;
        this.stepDelivered = false;
      } else {
        this.stepAll = false;
      }

    } else if (orderStatus === 'new') {
      this.stepAll = false;
      this.stepNew = this.stepNew !== true;
    } else if (orderStatus === 'accepted') {
      this.stepAll = false;
      this.stepAccepted = this.stepAccepted !== true;
    } else if (orderStatus === 'assigned') {
      this.stepAll = false;
      this.stepAssigned = this.stepAssigned !== true;
    } else if (orderStatus === 'pickedup') {
      this.stepAll = false;
      this.stepPickedup = this.stepPickedup !== true;
    } else if (orderStatus === 'delivered') {
      this.stepAll = false;
      this.stepDelivered = this.stepDelivered !== true;
    }
    if (
      this.stepNew === false &&
      this.stepAccepted === false &&
      this.stepAssigned === false &&
      this.stepPickedup === false &&
      this.stepDelivered === false
    ) {
      this.stepAll = true;
    }
    // this.setOrdersInList(orderStatus);
    this.getOrdersByStatus() ;
  }

  // setOrdersInList(orderStatus: string) {
  //   if (orderStatus === 'all') {
  //     return this.orders = this.allOrders;
  //   } else if (orderStatus === 'new') {
  //     return this.orders = this.newOrders;
  //   } else if (orderStatus === 'accepted') {
  //     return this.orders = this.acceptedOrders;
  //   } else if (orderStatus === 'assigned') {
  //     return this.orders = this.assignedOrders;
  //   } else if (orderStatus === 'pickedup') {
  //     return this.orders = this.pickedupOrders;
  //   } else if (orderStatus === 'delivered') {
  //     return this.orders = this.deliveredOrders;
  //   }
  // }

  getOrdersByStatus() {
    // this.jwtService.login('ultamesh@gmail.com', 'abc123');
    // this.jwtService
    //   .login('ultamesh@gmail.com', 'abc123')
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any[]) => {
    //     console.log(data);
    //   });
    // const logged = this.jwtService.loggedIn;
    const status = this.getStatusCSVString();
    if (status === 'all') {
      this.apiService
      .getOrders()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        this.all = data.length;
        console.log(data);
        this.orders = data;
        if (data.length > 0) {
          this.selectedOrder = this.orders[0];
        }
      });
    } else {
      this.apiService
      .getOrdersByStatusIn(status)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        // this.accepted = data.length;
        console.log(data);
        this.orders = data;
        if (data.length > 0) {
          this.selectedOrder = this.orders[0];
        }
      });
    }
  }

  // Compose status csv
  getStatusCSVString() {
    let status = '';
    if (this.stepAll) {
      status = 'all';
    } else {
      if (this.stepNew) {
        status += status === '' ? 'NEW' : ', NEW';
      }
      if (this.stepAccepted) {
        status += status === '' ? 'ACCEPTED' : ', ACCEPTED';
      }
      if (this.stepAssigned) {
        status += status === '' ? 'ASSIGNED' : ', ASSIGNED';
      }
      if (this.stepPickedup) {
        status += status === '' ? 'PICKED UP' : ', PICKED UP';
      }
      if (this.stepDelivered) {
        status += status === '' ? 'DELIVERED' : ', DELIVERED';
      }
    }
    return status;
  }

  setOrdersCountByStatus() {
    this.apiService
      .getOrdersCountByStatus('NEW')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.new = data;
      });
    this.apiService
      .getOrdersCountByStatus('ACCEPTED')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.accepted = data;
      });
    this.apiService
      .getOrdersCountByStatus('ASSIGNED')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.assigned = data;
      });
    this.apiService
      .getOrdersCountByStatus('PICKED UP')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.pickedup = data;
      });
    this.apiService
      .getOrdersCountByStatus('DELIVERED')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.delivered = data;
      });
  }

  // getKey(object: {}) {
  //   return Object.keys(object)[0];
  // }
  getKeys(object: {}) {
    return Object.keys(object);
  }

  onItemClick(order: Order) {
    this.selectedOrder = order;
  }
}
