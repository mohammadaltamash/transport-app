import {
  Component,
  OnInit,
  Inject,
  Optional,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Constants } from '../../../../model/constants';
import { Order } from '../../../../model/order';
import { ApiService } from '../../../../service/api.service';
import { Utilities } from '../../../../helper/utilities';
import { OrderCarrier } from '../../../../model/order-carrier';
import { OrderStatus } from '../../../../model/order-status';
// import { MapHelper } from '../../../../helper/map_helper';
import { AuthenticationService } from '../../../../service/authentication.service';

@Component({
  selector: 'app-book-order-dialog',
  templateUrl: './book-order-dialog.component.html',
  styleUrls: ['./book-order-dialog.component.scss']
})
export class BookOrderDialogComponent implements OnInit {
  public tools: object = {
    items: [
           'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
           'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
           'LowerCase', 'UpperCase', '|', 'Undo', 'Redo', '|',
           'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
           'Indent', 'Outdent', '|', 'CreateLink','CreateTable',
           'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
   };
   public editorValue = '';
  // @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  // map: google.maps.Map;
  // markers: any[];
  // expandedMap = false;
  // distance: number;

  daysToPay = Constants.DAYS_TO_PAY;
  paymentTermBegins = Constants.PAYMENT_TERM_BEGINS;
  offerReason = Constants.OFFER_REASON;
  offerValidity = Constants.OFFER_VALIDITY;

  // selectedPickupDate = new Date();
  // selectedDeliveryDate = new Date();

  bookingForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<BookOrderDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private utilities: Utilities
    // private mapHelper: MapHelper
  ) {

    // const m = {
    //   latitude: data.order.pickupLatitude,
    //   longitude: data.order.pickupLongitude,
    //   title: 'Pickup location',
    //   icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
    // };
    // this.mapHelper.distance.subscribe(
    //   d => this.distance = d
    // );

    // this.markers = [];
    // // this.markers.push(m);
    // this.markers.push({
    //   latitude: data.order.pickupLatitude,
    //   longitude: data.order.pickupLongitude,
    //   title: 'Pickup location',
    //   icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
    // });
    // this.markers.push({
    //   latitude: data.order.deliveryLatitude,
    //   longitude: data.order.deliveryLongitude,
    //   title: 'Drop off location',
    //   icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png'
    // });

    // this.mapHelper.getDistanceMatrix(
    //   data.order.pickupLatitude,
    //   data.order.pickupLongitude,
    //   data.order.deliveryLatitude,
    //   data.order.deliveryLongitude
    // );
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

    // this.mapHelper.getDistanceMatrix(
    //   this.data.order.pickupLatitude,
    //   this.data.order.pickupLongitude,
    //   this.data.order.deliveryLatitude,
    //   this.data.order.deliveryLongitude
    // );

    // alert(this.distance);
  }

  // ngAfterViewInit(): void {
    // this.mapHelper.initializeMap(this.gmap, this.markers, false);
  // }

  onSubmit() {
    const orderCarrier: OrderCarrier = this.bookingForm.value;
    orderCarrier.id = this.data.orderCarrier.id;
    orderCarrier.status = OrderStatus.BOOKED;

    // const order: Order = this.data.order;
    // order.carrierPay = this.bookingForm.value.carrierPay;
    // order.paymentTermBegins = this.bookingForm.value.paymentTermBegins;
    // order.committedPickupDate = this.bookingForm.value.committedPickupDate;
    // order.committedDeliveryDate = this.bookingForm.value.committedDeliveryDate;

    // const oc: OrderCarrier = order.bookingRequestCarriers.filter(c => c.id === this.data.orderCarrier.id)[0];
    // const orderCarriers: OrderCarrier[] = order.bookingRequestCarriers;
    // const oc: OrderCarrier = orderCarriers.find(c => c.carrier.id === this.data.orderCarrier.id);
    // oc.status = 'BOOKED';
    const jsonString = JSON.stringify(orderCarrier);
    this.apiService.bookOrder(this.data.order.id, this.data.orderCarrier.carrierId, orderCarrier).subscribe(
      // data => console.log(data.deliveryDates.endDate),
      res => console.log(res),
      err => console.log(err)
    );

    // const orderCarrier: OrderCarrier = this.bookingForm.value;
    this.utilities.showSuccess('Order booked', 'Booking');
    console.log(orderCarrier);
    this.dialogRef.close({ booked: true });
  }

  onCloseClick() {
    this.dialogRef.close({ booked: true });
  }

  // onMapButtonClick() {
  //   this.expandedMap = !this.expandedMap;
  // }
  shouldDisplayAddress(order: Order) {
    return (
      order.createdBy !== null &&  order.createdBy !== undefined &&
      order.createdBy.email ===
        this.authenticationService.currentUserValue.email
    );
  }
}
