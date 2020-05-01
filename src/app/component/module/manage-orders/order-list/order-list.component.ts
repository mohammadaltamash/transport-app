import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ApiService } from '../../../../service/api.service';
import { Order } from '../../../../model/order';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Utilities } from '../../../../helper/utilities';
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../model/user';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DriversListDialogComponent } from '../../../../component/drivers-list-dialog/drivers-list-dialog.component';
import { AuthenticationService } from '../../../../service/authentication.service';
import { AppComponent } from 'src/app/app.component';
import { AuditResponse } from 'src/app/model/audit-response';
import { OrderStatus } from 'src/app/model/order-status';
import { BookOrderDialogComponent } from '../book-order-dialog/book-order-dialog.component';
import { OrderCarrier } from 'src/app/model/order-carrier';
import { InviteOrderDialogComponent } from '../invite-order-dialog/invite-order-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/model/constants';
import { PagedOrders } from 'src/app/model/paged-orders';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  config: any;
  all = 0;
  new = 0;
  booked = 0;
  accepted = 0;
  assigned = 0;
  pickedup = 0;
  delivered = 0;

  stepAll = true;
  stepNew = false;
  stepBooked = false;
  stepAccepted = false;
  stepAssigned = false;
  stepPickedup = false;
  stepDelivered = false;

  orders: Order[] = [];
  // allOrders: Order[] = [];
  // newOrders: Order[] = [];
  // bookedOrders: Order[] = [];
  // acceptedOrders: Order[] = [];
  // assignedOrders: Order[] = [];
  // pickedupOrders: Order[] = [];
  // deliveredOrders: Order[] = [];
  selectedOrder: Order;
  selectedItem: number;
  drivers: User[];
  auditResponse: AuditResponse[];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private appComponent: AppComponent,
    private utilities: Utilities,
    public driversDialog: MatDialog,
    public bookingDialog: MatDialog,
    public invitationDialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.config = {
      currentPage: 0,
      itemsPerPage: Constants.ORDERS_PER_PAGE,
      totalItems: 0
    };

    // this.spinner.show();
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

    this.appComponent.currentOrder.subscribe(o => {
      this.selectedOrder = o;
      // this.getOrderAudit(this.selectedOrder.id);
    });
    // if (this.selectedOrder !== null) {
    //   this.getOrderAudit(this.selectedOrder.id);
    // }
    this.getOrdersByStatus();
    this.setOrdersCountByStatus();
    this.updateDriversList();
    // of(this.setAssigned()).subscribe(assigned => {
    //   this.assigned = assigned;
    //   // this.createOrderForm.controls.vehicleModels.patchValue(this.vehicleModels[0]);
    // });
    // of(this.setAccepted()).subscribe(accepted => {
    //   this.accepted = accepted;
    //   // this.createOrderForm.controls.vehicleModels.patchValue(this.vehicleModels[0]);
    // });
    // this.spinner.hide();
  }

  // nafterViewInit() {
  //   this.getOrdersByStatus();
  //   this.setOrdersCountByStatus();
  // }

  // setAssigned() {
  //   return this.assigned - 1;
  // }
  // setAccepted() {
  //   return this.accepted + 1;
  // }

  getClassByStatus(orderStatus: string) {
    if (orderStatus === 'all') {
      return this.getClass(this.stepAll);
    } else if (orderStatus === 'new') {
      return this.getClass(this.stepNew);
    } else if (orderStatus === 'booked') {
      return this.getClass(this.stepBooked);
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
    this.config.currentPage = 0;
    if (orderStatus === 'all') {
      if (this.stepAll === false) {
        this.stepAll = true;
        this.stepNew = false;
        this.stepBooked = false;
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
    } else if (orderStatus === 'booked') {
      this.stepAll = false;
      this.stepBooked = this.stepBooked !== true;
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
      this.stepBooked === false &&
      this.stepAccepted === false &&
      this.stepAssigned === false &&
      this.stepPickedup === false &&
      this.stepDelivered === false
    ) {
      this.stepAll = true;
    }
    // this.setOrdersInList(orderStatus);
    this.getOrdersByStatus();
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
    // const status = this.getStatusCSVString();
    // this.selectedOrder = null;
    // this.auditResponse = null;
    // if (status === 'all') {
    //   this.spinner.show();

    //   // this.apiService
    //   //   .getOrdersCount()
    //   //   // .pipe(takeUntil(this.destroy$))
    //   //   .subscribe((data: number) => {
    //   //     console.log(data);
    //   //     this.config.totalItems = data;
    //   //     this.all = data;
    //   //   });
    //   this.apiService
    //     .getPagedOrders(0, this.config.itemsPerPage)
    //     // .pipe(takeUntil(this.destroy$))
    //     .subscribe((data: PagedOrders) => {
    //       // this.all = data.length;
    //       this.spinner.hide();
    //       console.log(data);
    //       this.orders = data.orders;
    //       this.config.totalItems = data.totalItems;
    //       this.all = data.totalItems;
    //       if (data.orders.length > 0) {
    //         this.selectedOrder = this.orders[0];
    //         this.getOrderAudit(this.selectedOrder.id);
    //       }
    //     });
    //   // this.apiService
    //   //   .getOrders()
    //   //   .pipe(takeUntil(this.destroy$))
    //   //   .subscribe((data: any[]) => {
    //   //     this.spinner.hide();
    //   //     this.all = data.length;
    //   //     console.log(data);
    //   //     this.orders = data;
    //   //     if (data.length > 0) {
    //   //       this.selectedOrder = this.orders[0];
    //   //       this.getOrderAudit(this.selectedOrder.id);
    //   //     }
    //   //   });
    // } else {
    //   this.spinner.show();
    //   this.apiService
    //     .getOrdersByStatusIn(status, 0, this.config.itemsPerPage)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe((data: any[]) => {
    //       this.spinner.hide();
    //       // this.accepted = data.length;
    //       console.log(data);
    //       this.orders = data;
    //       if (data.length > 0) {
    //         this.selectedOrder = this.orders[0];
    //         this.getOrderAudit(this.selectedOrder.id);
    //       }
    //     });
    // }

    this.fetchOrders(0);
  }

  pageChange(newPage: number) {
    this.fetchOrders(newPage - 1);
    this.config.currentPage = newPage;
  }

  fetchOrders(pageNumber: number) {
    const status = this.getStatusCSVString();
    this.selectedOrder = null;
    this.auditResponse = null;
    if (status === 'all') {
      this.spinner.show();
      this.apiService
        .getPagedOrders(pageNumber, this.config.itemsPerPage)
        // .pipe(takeUntil(this.destroy$))
        .subscribe((data: PagedOrders) => {
          // this.all = data.length;
          this.spinner.hide();
          console.log(data);
          this.orders = data.orders;
          this.config.totalItems = data.totalItems;
          this.all = data.totalItems;
          if (data.orders.length > 0) {
            this.selectedOrder = this.orders[0];
            this.getOrderAudit(this.selectedOrder.id);
          }
        });
    } else {
      this.spinner.show();
      this.apiService
        .getOrdersByStatusIn(status, pageNumber, this.config.itemsPerPage)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: PagedOrders) => {
          this.spinner.hide();
          // this.accepted = data.length;
          console.log(data);
          this.orders = data.orders;
          this.config.totalItems = data.totalItems;
          if (data.orders.length > 0) {
            this.selectedOrder = this.orders[0];
            this.getOrderAudit(this.selectedOrder.id);
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
      if (this.stepBooked) {
        status += status === '' ? 'BOOKED' : ', BOOKED';
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
      .getOrdersCountByStatus('BOOKED')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: number) => {
        this.booked = data;
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

  isAssigned() {
    return (
      this.selectedOrder !== null &&
      this.selectedOrder.orderStatus === environment.ASSIGNED_ORDER
    );
  }

  bookClicked() {
    this.selectedOrder.orderStatus = environment.ACCEPTED_ORDER;
    this.selectedOrder.brokerContactName = this.authenticationService.currentUserValue.fullName;
    this.selectedOrder.brokerCompanyName = this.authenticationService.currentUserValue.companyName;
    this.selectedOrder.brokerAddress = this.authenticationService.currentUserValue.address;
    this.selectedOrder.brokerZip = this.authenticationService.currentUserValue.zip;
    this.selectedOrder.brokerLatitude = this.authenticationService.currentUserValue.latitude;
    this.selectedOrder.brokerLongitude = this.authenticationService.currentUserValue.longitude;
    this.selectedOrder.shipperPhones = this.authenticationService.currentUserValue.phones;
    this.selectedOrder.brokerEmail = this.authenticationService.currentUserValue.email;
    this.apiService.updateOrder(this.selectedOrder).subscribe(
      // data => console.log(data.deliveryDates.endDate),
      res => console.log(res),
      err => console.log(err)
    );
    this.utilities.openSnackBar('Order has been booked', '');
    // this.setOrdersCountByStatus();
    // this.getOrdersByStatus();
    this.accepted = this.accepted + 1;
    this.assigned = this.assigned - 1;
    document.getElementById('accepted').innerText =
      'Accepted (' + this.accepted + ')';
    document.getElementById('assigned').innerText =
      'Assigned (' + this.assigned + ')';
    if (this.stepAll === false) {
      this.orders.splice(this.selectedItem, 1);
    }
  }

  onItemClick(order: Order, index: number) {
    this.selectedOrder = order;
    this.selectedItem = index;
    this.getOrderAudit(this.selectedOrder.id);
  }

  updateDriversList() {
    this.userService
      .getUsersByType(environment.USER_DRIVER)
      // .pipe(takeUntil(this.destroy$))
      .subscribe((data: User[]) => {
        this.drivers = data;
        console.log(data);
      });
  }

  onAssignDriver(orderNumber: number): void {
    const dialogRef = this.driversDialog.open(DriversListDialogComponent, {
      width: '30vw',
      data: {
        drivers: this.drivers,
        orderId: orderNumber
      },
      disableClose: true,
      backdropClass: 'backdropBackground',
      autoFocus: false
    });
  }

  getDispatchInstructions() {
    return this.selectedOrder !== null &&
      this.selectedOrder.dispatchInstructions !== null
      ? this.selectedOrder.dispatchInstructions
      : 'No instructions from the broker';
  }

  getOrderAudit(id: number) {
    this.apiService
      .getAudit('Order', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: AuditResponse[]) => {
        this.auditResponse = data;
        console.log(`AuditResponse: ${data}`);
      });
  }

  getName(response: { fullName: string; userName: string }) {
    return response.fullName !== null ? response.fullName : response.userName;
  }

  getOrderCarrier(value) {
    return JSON.parse(value);
  }
  getActionString(response: AuditResponse, property) {
    const name = this.getName(response);
    if (response.operation === 'ADD') {
      return `${name} created order`;
    } else if (response.operation === 'MOD') {
      if (property.propertyName === 'bookingRequestCarriers') {
        const orderCarrier: OrderCarrier = this.getOrderCarrier(property.value);
        if (orderCarrier.status === OrderStatus.BOOKING_REQUEST) {
          return `${name} sent a booking request`;
        }
      }
      return `${name} changed ${property.formattedPropertyName} to '${property.value}'`;
    }
  }

  showBookOrder(property: string, value: string) {
    if (property === 'bookingRequestCarriers') {
      const orderCarrier: OrderCarrier = this.getOrderCarrier(value);
      return (orderCarrier.status === OrderStatus.BOOKING_REQUEST
      );
    }
    return false;
  }

  openBookingDialog(orderCarrierRecord: string) {
    // this.bookDialog.openDialog();
    // const result = this.bookOrderDialogComponent.openDialog(this.selectedOrder);
    // this.selectedItem = index;
    // this.appComponent.setCurrentOrderValue(order);
    const dialogRef = this.bookingDialog.open(BookOrderDialogComponent, {
      // width: '50vw',
      // height: '95vh',
      data: {
        order: this.selectedOrder,
        orderCarrier: JSON.parse(orderCarrierRecord)
      },
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }

  openInvitationDialog(orderCarrierRecord: string) {
    // this.bookDialog.openDialog();
    // const result = this.bookOrderDialogComponent.openDialog(this.selectedOrder);
    // this.selectedItem = index;
    // this.appComponent.setCurrentOrderValue(order);
    const dialogRef = this.invitationDialog.open(InviteOrderDialogComponent, {
      // width: '50vw',
      // height: '95vh',
      data: {
        order: this.selectedOrder,
        orderCarrier: JSON.parse(orderCarrierRecord)
      },
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    // });
  }
}

// @Component({
//   selector: 'app-drivers-list-dialog-component',
//   templateUrl: 'drivers-list-dialog.html'
// })
// export class DriversListDialogComponent {
//   drivers: User[];
//   constructor(
//     public dialogRef: MatDialogRef<DriversListDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: User[],
//     private userService: UserService
//   ) {
//     this.drivers = data;
//   }

// }
