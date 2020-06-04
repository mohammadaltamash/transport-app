import { Component, OnInit, Inject, Optional, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Constants } from '../../../../model/constants';
import { Order } from '../../../../model/order';
import { ApiService } from '../../../../service/api.service';
import { Utilities } from '../../../../helper/utilities';
import { OrderCarrier } from '../../../../model/order-carrier';
import { OrderStatus } from '../../../../model/order-status';
import { MapHelper } from '../../../../helper/map_helper';
import { AppComponent } from '../../../../app.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../../../../service/authentication.service';

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

  destroy$: Subject<boolean> = new Subject<boolean>();
  inviteForm: FormGroup;

  currentAccepted: number;

  constructor(
    private dialogRef: MatDialogRef<InviteOrderDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private utilities: Utilities,
    private mapHelper: MapHelper,
    private appComponent: AppComponent
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

    // this.appComponent.currentAccepted.subscribe(
    //   a => this.currentAccepted = a
    // );
  }

  ngOnInit() {
    this.inviteForm = this.formBuilder.group({
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
    this.mapHelper.initializeMap(this.gmap, this.markers, false);
  }

  onSubmit(buttonType: string) {
    // alert(buttonType);
    // return;
    this.apiService.acceptOrDecline(this.data.order.id, this.data.orderCarrier.id, buttonType)
                   .subscribe(((data: OrderCarrier) => {
                            // data => console.log(data.deliveryDates.endDate),
                            // res => console.log(res),
                            // err => console.log(err)
                            // if (data.status === OrderStatus.ACCEPTED) {
                            //   // const acceptCount = this.appComponent.currentAcceptedValue + 1;
                            //   // this.appComponent.setCurrentAcceptedValue(acceptCount);
                            //   this.apiService.getOrdersCountByStatus('ACCEPTED')
                            //                   .pipe(takeUntil(this.destroy$))
                            //                   .subscribe((count: number) => {
                            //                     // this.accepted = data;
                            //                     this.appComponent.setCurrentAcceptedValue(count);
                            //     // this.appComponent.setCurrentNewValue(this.new - 1);
                            //   });
                            // }
                            })
    );

    // const orderCarrier: OrderCarrier = this.bookingForm.value;
    if (buttonType === OrderStatus.ACCEPTED) {
      this.utilities.showSuccess('Order accepted', 'Invitation');
      this.dialogRef.close({ accepted: true });
    } else if (buttonType === OrderStatus.DECLINED) {
      this.utilities.showInfo('Order declined', 'Invitation');
      this.dialogRef.close({ accepted: false });
    }
  }

  onCloseClick() {
    this.dialogRef.close();
  }

  shouldDisplayAddress(order: Order) {
    return (
      order.createdBy !== null &&  order.createdBy !== undefined &&
      order.createdBy.email ===
        this.authenticationService.currentUserValue.email
    );
  }
}
