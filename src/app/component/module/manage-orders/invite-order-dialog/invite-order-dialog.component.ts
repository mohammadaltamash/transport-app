import { Component, OnInit, Inject, Optional, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Constants } from 'src/app/model/constants';
import { Order } from 'src/app/model/order';
import { ApiService } from 'src/app/service/api.service';
import { Utilities } from 'src/app/helper/utilities';
import { OrderCarrier } from 'src/app/model/order-carrier';
import { OrderStatus } from 'src/app/model/order-status';
import { MapHelper } from 'src/app/helper/map_helper';

@Component({
  selector: 'app-invite-order-dialog',
  templateUrl: './invite-order-dialog.component.html',
  styleUrls: ['./invite-order-dialog.component.scss']
})
export class InviteOrderDialogComponent implements OnInit, AfterViewInit {

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  markers: any[];

  daysToPay = Constants.DAYS_TO_PAY;
  paymentTermBegins = Constants.PAYMENT_TERM_BEGINS;
  offerReason = Constants.OFFER_REASON;
  offerValidity = Constants.OFFER_VALIDITY;

  // selectedPickupDate = new Date();
  // selectedDeliveryDate = new Date();

  bookingForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<InviteOrderDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private utilities: Utilities,
    private mapHelper: MapHelper
  ) {
    this.markers = [];
    this.markers.push({
      latitude: data.order.pickupLatitude,
      longitude: data.order.pickupLongitude,
      title: 'Pickup location',
      icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
    });
    this.markers.push({
      latitude: data.order.deliveryLatitude,
      longitude: data.order.deliveryLongitude,
      title: 'Drop off location',
      icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png'
    });
  }

  ngOnInit() {
    this.bookingForm = this.formBuilder.group({
      // id: '',
      brokerOrderId: this.data.order.brokerOrderId,
      carrierPay: this.data.order.carrierPay,
      daysToPay: this.data.orderCarrier.daysToPay,
      paymentTermBegins: this.data.orderCarrier.paymentTermBegins,
      committedPickupDate: new Date(this.data.orderCarrier.committedPickupDate),
      committedDeliveryDate: new Date(
        this.data.orderCarrier.committedDeliveryDate
      ),
      offerReason: this.data.orderCarrier.offerReason,
      offerValidity: this.data.orderCarrier.offerValidity
    });
  }

  ngAfterViewInit(): void {
    this.mapHelper.initializeMap(this.gmap, this.markers);
  }

  onSubmit(buttonType: string) {
    alert(buttonType);
    // return;
    this.apiService.acceptOrDecline(this.data.order.id, this.data.orderCarrier.id, buttonType).subscribe(
      // data => console.log(data.deliveryDates.endDate),
      res => console.log(res),
      err => console.log(err)
    );

    // const orderCarrier: OrderCarrier = this.bookingForm.value;
    if (buttonType === OrderStatus.ACCEPTED) {
      this.utilities.openSnackBar('Order accepted', '');
    } else if (buttonType === OrderStatus.DECLINED) {
      this.utilities.openSnackBar('Order declined', '');
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }

}
