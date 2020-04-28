import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../model/user';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UserService } from '../../service/user.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { Utilities } from 'src/app/helper/utilities';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { RegisterComponent } from '../module/auth-components/register/register.component';

@Component({
  selector: 'app-drivers-list-dialog',
  templateUrl: './drivers-list-dialog.component.html',
  styleUrls: ['./drivers-list-dialog.component.scss']
})
export class DriversListDialogComponent implements OnInit {
  drivers: User[];
  selection: number;
  invalid = false;
  assignDriverForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DriversListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utilities: Utilities,
    public newUserDialog: MatDialog
  ) {
    this.drivers = data.drivers;
  }

  ngOnInit() {
    this.assignDriverForm = this.formBuilder.group({
      // id: '',
      // brokerOrderId: this.data.order.brokerOrderId,
      // carrierPay: this.data.order.carrierPay,
      // daysToPay: this.data.orderCarrier.daysToPay,
      // paymentTermBegins: this.data.orderCarrier.paymentTermBegins,
      // committedPickupDate: new Date(this.data.orderCarrier.committedPickupDate),
      // committedDeliveryDate: new Date(
      //   this.data.orderCarrier.committedDeliveryDate
      // ),
      // offerReason: this.data.orderCarrier.offerReason,
      // offerValidity: this.data.orderCarrier.offerValidity
    });
  }

  onSubmit() {
    // alert(this.selection);
    // const orderCarrier: OrderCarrier = this.bookingForm.value;
    // orderCarrier.id = this.data.orderCarrier.id;
    // orderCarrier.status = OrderStatus.BOOKED;

    // // const order: Order = this.data.order;
    // // order.carrierPay = this.bookingForm.value.carrierPay;
    // // order.paymentTermBegins = this.bookingForm.value.paymentTermBegins;
    // // order.committedPickupDate = this.bookingForm.value.committedPickupDate;
    // // order.committedDeliveryDate = this.bookingForm.value.committedDeliveryDate;

    // // const oc: OrderCarrier = order.bookingRequestCarriers.filter(c => c.id === this.data.orderCarrier.id)[0];
    // // const orderCarriers: OrderCarrier[] = order.bookingRequestCarriers;
    // // const oc: OrderCarrier = orderCarriers.find(c => c.carrier.id === this.data.orderCarrier.id);
    // // oc.status = 'BOOKED';
    // const jsonString = JSON.stringify(orderCarrier);
    if (this.selection !== undefined) {
      this.apiService
        .assignDriver(this.drivers[this.selection].id, this.data.orderId)
        .subscribe(
          // data => console.log(data.deliveryDates.endDate),
          res => console.log(res),
          err => console.log(err)
        );
    } else {
      this.invalid = true;
      this.assignDriverForm.reset();
    }
  }

  onNewDriver(): void {
    const dialogRef = this.newUserDialog.open(CreateDialogComponent, {
      width: '30vw',
      data: 'DRIVER',
      disableClose: true,
      backdropClass: 'backdropBackgroundTransparent'
    });
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
