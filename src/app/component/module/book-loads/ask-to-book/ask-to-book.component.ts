import {
  Component,
  OnInit,
  Inject,
  Optional,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { Order } from '../../../../model/order';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
import { ApiService } from '../../../../service/api.service';
import { Utilities } from '../../../../helper/utilities';
import { environment } from '../../../../../environments/environment';
import { AuthenticationService } from '../../../../service/authentication.service';
import { OrderCarrier } from '../../../../model/order-carrier';
import { OrderStatus } from '../../../../model/order-status';
import { Constants } from '../../../../model/constants';
import { MapHelper } from '../../../../helper/map_helper';
import { AppComponent } from 'src/app/app.component';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-ask-to-book',
  templateUrl: './ask-to-book.component.html',
  styleUrls: ['./ask-to-book.component.scss']
  // encapsulation: ViewEncapsulation.None,
})
export class AskToBookComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  // lat = 40.73061;
  // lng = -73.935242;
  // coordinates = new google.maps.LatLng(this.lat, this.lng);
  // mapOptions: google.maps.MapOptions = {
  //   center: this.coordinates,
  //   zoom: 8
  // };
  // marker = new google.maps.Marker({
  //   position: this.coordinates,
  //   map: this.map,
  //   title: 'Hello world',
  // });
  markers: any[];

  daysToPay = Constants.DAYS_TO_PAY;

  paymentTermBegins = Constants.PAYMENT_TERM_BEGINS;

  offerReason = Constants.OFFER_REASON;

  offerValidity = Constants.OFFER_VALIDITY;

  bookingRequestForm: FormGroup;
  pickupStart = new Date();
  pickupEnd = new Date();
  deliveryStart = new Date();
  deliveryEnd = new Date();
  selectedDate = new Date();
  selectedPickupDate = new Date();
  selectedDeliveryDate = new Date();
  requestBooking = false;
  date: FormControl;
  // dateClass: string;

  constructor(
    private dialogRef: MatDialogRef<AskToBookComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private utilities: Utilities,
    private mapHelper: MapHelper,
    private appComponent: AppComponent,
    private messageService: MessageService
  ) {
    this.pickupEnd.setDate(this.pickupEnd.getDate() + 1);
    this.pickupStart.setDate(this.pickupStart.getDate() - 5);
    this.selectedDate.setDate(new Date().getDate() + 1);
    this.selectedPickupDate =
      this.data.order.preferredPickupDate !== null
        ? new Date(this.data.order.preferredPickupDate)
        : data.order.pickupDates.begin;
    this.selectedDeliveryDate =
      this.data.order.preferredDeliveryDate !== null
        ? new Date(this.data.order.preferredDeliveryDate)
        : data.order.deliveryDates.begin;
    this.date = new FormControl(this.selectedDate);

    this.markers = [];
    this.markers.push({
      latitude: data.order.pickupLatitude,
      longitude: data.order.pickupLongitude,
      title: 'Pickup location',
      icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png',
      order: this.data.order
    });
    this.markers.push({
      latitude: data.order.deliveryLatitude,
      longitude: data.order.deliveryLongitude,
      title: 'Drop off location',
      icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png',
      order: this.data.order
    });
    this.requestBooking = data.requestBooking;
  }

  ngOnInit() {
    this.bookingRequestForm = this.formBuilder.group({
      // id: '',
      brokerOrderId: '',
      carrierPay: [this.data.order.carrierPay, Validators.required],

      daysToPay: '',
      paymentTermBegins: [this.data.order.paymentTermBegins], //?
      committedPickupDate: [this.selectedPickupDate, Validators.required],
      committedDeliveryDate: [this.selectedDeliveryDate, Validators.required],
      offerReason: '',
      offerValidity: ''
    });
  }

  ngAfterViewInit(): void {
    this.mapHelper.initializeMap(this.gmap, this.markers, null, false);
  }

  onSubmit() {
    // this.askToBookForm.setValue(order);
    // if (this.askToBookForm.invalid) {
    //   return;
    // }
    const o: Order = this.data.order;
    // o.id = orderId;
    o.orderStatus = environment.ASSIGNED_ORDER;
    const carriers = o.bookingRequestCarriers;
    const orderCarrier: OrderCarrier = new OrderCarrier();
    // carrierPay: number;
    // daysToPay: string;
    // paymentTermBegins: string;
    // committedPickupDate: Date;
    // committedDeliveryDate: Date;
    // offerReason: string;
    // offerValidity: string;
    // orderCarrier.order = o;
    // orderCarrier.carrier = this.authenticationService.currentUserValue;
    orderCarrier.status = OrderStatus.BOOKING_REQUEST;
    orderCarrier.carrierPay = this.bookingRequestForm.value.carrierPay;
    orderCarrier.daysToPay = this.bookingRequestForm.value.daysToPay;
    orderCarrier.paymentTermBegins = this.bookingRequestForm.value.paymentTermBegins;
    orderCarrier.committedPickupDate = this.bookingRequestForm.value.committedPickupDate;
    orderCarrier.committedDeliveryDate = this.bookingRequestForm.value.committedDeliveryDate;
    orderCarrier.offerReason = this.bookingRequestForm.value.offerReason;
    orderCarrier.offerValidity = this.bookingRequestForm.value.offerValidity;
    carriers.push(orderCarrier);
    // o.askedToBook = this.authenticationService.currentUserValue.id;
    o.bookingRequestCarriers = carriers;
    this.apiService
      .createOrderRequest(
        orderCarrier,
        this.data.order.id,
        this.authenticationService.currentUserValue.email
      )
      .subscribe(() => {
        this.utilities.openSnackBar('Booking request has been sent', '');
        this.dialogRef.close();
        this.messageService._send('NEW_ORDER');
      });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    const date = d.getDate();
    // alert(date);

    // Highlight the 1st and 20th day of each month.
    // return (date === 1 || date === 20) ? 'example-custom-date-class' : '';
    // return (date === 1 || date === 20) ? 'example-custom-date-class' : '';
    return 'example-custom-date-class';
  }

  // mapInitializer(): void {
  //   // this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);
  //   this.map = new google.maps.Map(this.gmap.nativeElement);
  //   // this.marker.addListener('click', () => {
  //   //   const infoWindow = new google.maps.InfoWindow({
  //   //     content: this.marker.getTitle()
  //   //   });
  //   //   infoWindow.open(this.marker.getMap(), this.marker);
  //   // });
  //   // default marker
  //   // this.marker.setMap(this.map);
  //   this.loadAllMarkers();
  // }

  // loadAllMarkers() {
  //   const bounds = new google.maps.LatLngBounds();
  //   this.markers.forEach(markerInfo => {
  //     // console.log(markerInfo);
  //     const marker = new google.maps.Marker({
  //       ...markerInfo
  //       // position: markerInfo.position,
  //       // map: this.map,
  //       // title: markerInfo.title
  //     });
  //     const infoWindow = new google.maps.InfoWindow({
  //       // content: marker.getTitle()
  //       content: this.getMarkerInfo(marker.getTitle())
  //     });
  //     marker.addListener('click', () => {
  //       infoWindow.open(marker.getMap(), marker);
  //     });
  //     marker.setMap(this.map);

  //     // const bounds = new google.maps.LatLngBounds();
  //     bounds.extend(marker.getPosition());
  //     // this.map.setCenter(bounds.getCenter());
  //     // this.map.fitBounds(bounds);
  //   });
  //   this.map.setCenter(bounds.getCenter());
  //   this.map.fitBounds(bounds);
  // }

  // getMarkerInfo(title: string) {
  //   return `<html><body><div style="font-weight: bold">${title}</div><div></div></body></html>`;
  // }

  shouldDisplayAddress(order: Order) {
    return (
      order.createdBy !== null &&
      order.createdBy.email ===
        this.authenticationService.currentUserValue.email
    );
  }
}
