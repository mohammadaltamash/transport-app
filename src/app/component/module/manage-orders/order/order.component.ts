import { Component, OnInit, ViewChild, ElementRef, Inject, Optional } from '@angular/core';
import { ApiService } from '../../../../service/api.service';
import { Order } from '../../../../model/order';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
// import { Address } from 'cluster';
import {Location, Appearance, GermanAddress} from '@angular-material-extensions/google-maps-autocomplete';
import {} from 'googlemaps';
import PlaceResult = google.maps.places.PlaceResult;

import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { Router } from '@angular/router';

import {MatSnackBar} from '@angular/material';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  zipMask = [/\d/, /\d/, /\d/, /\d/, /\d/];
  phoneMask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // @ViewChild('pickupPhone1') phone1Element: ElementRef;
  // document: Document;
  // @ViewChild('pickupPhone1', {static: false}) public pickupPhone1: ElementRef;
  // @ViewChild('pickupPhone1') pickupPhone1: ElementRef;
  // @ViewChild('placesRef') placesRef: GooglePlaceDirective;

  // Map Api ngx
  formattedAddress = '';
    options = {
      componentRestrictions: {
        country: ['US']
    }
  };

  public appearance = Appearance;
  public zoom: number;
  public pickupLatitude: number;
  public pickupLongitude: number;
  public deliveryLatitude: number;
  public deliveryLongitude: number;
  public brokerLatitude: number;
  public brokerLongitude: number;
  public selectedAddress: PlaceResult;
  country = 'us';
  addressIsValid = false;
  pickupAddress: string;
  deliveryAddress: string;
  brokerAddress: string;
  // pickupZip = null;
  // deliveryZip = null;
  validationResult: any[] = [];
  pickupAddressValid = true;
  deliveryAddressValid = true;
  brokerAddressValid = true;
  pickupZipValid = true;
  deliveryZipValid = true;
  brokerZipValid = true;

  preferredPickupDateBegin;
  preferredPickupDateEnd;
  preferredDeliveryDateBegin;
  preferredDeliveryDateEnd;

  orders: Order[] = [];
  pagedOrders: Order[] = [];
  order: Order;
  destroy$: Subject<boolean> = new Subject<boolean>();
  result: Date;
  vehicleModels: string[];
  // test = 'some data';

  autotypes: string[] = [
    'Sedan',
    'Mini-van',
    'Motorcycle',
    'Pickup',
    'Suv',
    'Van'
  ];

  datesRestrictions: string[] = [
    'No restrictions',
    'No later 02/20/2020',
    'No earlier 02/12/2020',
    'No earlier 02/12/2020 - No later 02/20/2020'
  ];

  paymentOnPickupMethod: string[] = [
    'Cash/Certified Funds',
    'Business Check',
    'Cashier\'s Check'
  ];

  paymentOnDeliveryMethod: string[] = [
    'Cash/Certified Funds',
    'Business Check',
    'Cashier\'s Check',
    'uShip code'
  ];

  paymentTermBusinessDays: string[] = [
    'Immediately',
    '2 business days (Quick Pay)',
    '5 business days',
    '10 business days',
    '15 business days',
    '30 business days'
  ];

  paymentTermBegins: string[] = [ // ask-to-book
    'Pickup',
    'Delivery',
    'Receiving a uShip code',
    'Receiving a signed BOL'
  ];

  paymentMethod: string[] = [
    'Cash',
    'Certified Funds',
    'ACH (direct deposit)',
    'Company Check',
    'Wire Transfer',
    'Comchek'
  ];

  validationMessages = {};
  formIsValid = true;
  // formErrors = {};

  createOrderForm: FormGroup;

  ///////////////////////////////////////// Callbacks /////////////////////////////////////////

  constructor(
    // @Inject(DOCUMENT) document,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,

    private router: Router,
    public dialogRef: MatDialogRef<OrderComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.validationMessages = {
      // brokerOrderId: {
      //   required: '<strong>Broker Order ID</strong> is mandatory'
      // },
      required: 'Please fill out',
      invalidZip: 'Invalid zipcode',
      phone: 'Atlease one phone is required',
      email: 'Email is invalid'
    };

    // this.formErrors = {
    //   brokerOrderId: ''
    // };
    // this.document = document;
  }

  ngOnInit() {
    // this.apiService.getOrders().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
    //   console.log(data);
    //   this.orders = data;
    // });
    // this.apiService.getPagedOrders().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
    //   console.log(data);
    //   this.pagedOrders = data;
    // });
    this.createOrderForm = this.formBuilder.group({
      // id: '',
      brokerOrderId: ['', Validators.required],
      enclosedTrailer: '',
      m22Inspection: '',
      // Pickup Contact & Location
      pickupContactName: '',
      pickupCompanyName: '',
      pickupAddress: ['', Validators.required],
      pickupZip: ['', [Validators.required, Validators.maxLength(5)]],
      pickupPhonez: new FormArray([this.createPhoneItem()]),
      pickupPhones: {},
      pickupSignatureNotRequired: '',
      pickupDates: [{}, Validators.required],
      // pickupDates: {},
      pickupDatesRestrictions: this.datesRestrictions[0],
      preferredPickupDate: {value: '', disabled: true},

      // Delivery Contact & Location
      deliveryContactName: '',
      deliveryCompanyName: '',
      deliveryAddress: ['', Validators.required],
      deliveryZip: ['', [Validators.required, Validators.maxLength(5)]],
      deliveryPhonez: new FormArray([this.createPhoneItem()]),
      deliveryPhones: {},
      deliverySignatureNotRequired: '',
      // deliveryDates: [{}, Validators.required],
      deliveryDates: [{}, Validators.required],
      deliveryDatesRestrictions: this.datesRestrictions[0],
      preferredDeliveryDate: {value: '', disabled: true},

      // Add New Vehicle
      vehicleYear: '',
      vehicleMake: ['', Validators.required],
      vehicleModel: {value: '', disabled: true},
      vehicleAutoType: {value: 'Sedan', disabled: true}, // default
      vehicleColor: '',
      vehicleVIN: '',
      vehicleLOTNumber: '',
      vehicleBuyerId: '',
      vehicleInoperable: '',

      // Dispatch Information
      dispatchInstructions: '',

      // Pricing Information
      carrierPay: ['', Validators.required],
      amountOnPickup: '',
      paymentOnPickupMethod: '',
      amountOnDelivery: '',
      paymentOnDeliveryMethod: '',
      ///////////////////////////////
      paymentTermBusinessDays: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentTermBegins: ['', Validators.required],
      paymentNotes: '',
      ///////////////////////////////
      // Shipper Information
      brokerContactName: '',
      brokerCompanyName: ['', Validators.required],
      brokerAddress: ['', Validators.required],
      brokerZip: ['', [Validators.required, Validators.maxLength(5)]],
      shipperPhonez: new FormArray([this.createPhoneItem()]),
      shipperPhones: {},
      brokerEmail: ['', [Validators.required, Validators.email]]
    });
    this.formControls.pickupDatesRestrictions.disable();
    this.formControls.preferredPickupDate.disable();
    this.formControls.deliveryDatesRestrictions.disable();
    this.formControls.preferredDeliveryDate.disable();
    this.formControls.paymentOnPickupMethod.disable();
    this.formControls.paymentOnDeliveryMethod.disable();
    // this.formControls.paymentTermBusinessDays.disable();
    // this.formControls.paymentMethod.disable();
    // this.formControls.paymentTermBegins.disable();
    // this.formControls.paymentNotes.disable();
    // this.vehicleModels = this.getModels('General Motors');

    // async orders
    of(this.getModels()).subscribe(vehicleModels => {
      this.vehicleModels = vehicleModels;
      // this.createOrderForm.controls.vehicleModels.patchValue(this.vehicleModels[0]);
    });
  }

  ngDestroy() {
    this.destroy$.next(true);
    // Unsubscribe form the subject
    this.destroy$.unsubscribe();
    // alert('Called');
  }

  ///////////////////////////////////////// Events /////////////////////////////////////////

  onSubmit() {
    // alert(this.document.getElementById('pickupPhone1').value);
    // alert(this.pickupPhone1.nativeElement);
    // const val = document.getElementById('pickupPhone1');
    // alert(this.createOrderForm.get('phone').value);
    // const pickupPhone1 = this.formControls.pickupPhone1.value;
    if (!this.createOrderForm.valid) {
      this.formIsValid = false;
    }
    if (this.createOrderForm.hasError) {
      // alert('Form has errors');
      // console.log(this.createOrderForm.hasError);
      // return;
    }
    if (this.createOrderForm.valid) {
      const pickupPhonesMap = {};
      for (const phone of this.pickupPhonez.controls) {
        if (phone.get('phone').value !== '') {
          pickupPhonesMap[phone.get('phone').value] = phone.get('note').value;
        }
      }
      const deliveryPhonesMap = {};
      for (const phone of this.deliveryPhonez.controls) {
        if (phone.get('phone').value !== '') {
          deliveryPhonesMap[phone.get('phone').value] = phone.get('note').value;
        }
      }
      const shipperPhonesMap = {};
      for (const phone of this.shipperPhonez.controls) {
        if (phone.get('phone').value !== '') {
          shipperPhonesMap[phone.get('phone').value] = phone.get('note').value;
        }
      }
      const o: Order = this.createOrderForm.value;
      o.pickupPhones = pickupPhonesMap;
      o.deliveryPhones = deliveryPhonesMap;
      o.shipperPhones = shipperPhonesMap;
      o.enclosedTrailer =
        JSON.stringify(this.createOrderForm.get('enclosedTrailer').value) ===
        'true';
      o.m22Inspection =
        JSON.stringify(this.createOrderForm.get('m22Inspection').value) ===
        'true';
      o.pickupSignatureNotRequired =
        JSON.stringify(
          this.createOrderForm.get('pickupSignatureNotRequired').value
        ) === 'true';
      o.deliverySignatureNotRequired =
        JSON.stringify(
          this.createOrderForm.get('deliverySignatureNotRequired').value
        ) === 'true';
      o.vehicleInoperable =
        JSON.stringify(this.createOrderForm.get('vehicleInoperable').value) ===
        'true';
      o.pickupAddress = this.pickupAddress;
      o.deliveryAddress = this.deliveryAddress;
      o.brokerAddress = this.brokerAddress;
      o.pickupLatitude = this.pickupLatitude;
      o.pickupLongitude = this.pickupLongitude;
      o.deliveryLatitude = this.deliveryLatitude;
      o.deliveryLongitude = this.deliveryLongitude;
      o.brokerLatitude = this.brokerLatitude;
      o.brokerLongitude = this.brokerLongitude;

      // this.httpClient
      //   .post<Order>(
      //     environment.REST_SERVICE + '/order/create',
      //     JSON.stringify(o),
      //     {
      //       headers: new HttpHeaders({
      //         'Content-Type': 'application/json'
      //       })
      //     }
      //   )
      //   .subscribe(
      //     // data => console.log(data.deliveryDates.endDate),
      //     res => console.log(res),
      //     err => console.log(err)
      //   );

      this.apiService.postOrder(o)
        .subscribe(
          // data => console.log(data.deliveryDates.endDate),
          res => console.log(res),
          err => console.log(err)
        );
      this.openSnackBar('Order has been created', '');
      // this.dialogRef.close();
      // this.router.navigate(['/orders']);
    }
  }

  changeModels() {
    this.vehicleModels = this.getModels();
    this.formControls.vehicleModel.enable();
    this.formControls.vehicleAutoType.enable();
  }

  onAddPhoneControl(control: FormArray) {
    if (control.length < 3) {
      control.push(this.createPhoneItem());
    }
  }

  onRemovePhoneControl(control: FormArray, index: number) {
    if (control.length > 1) {
      control.removeAt(index);
    }
  }

  onPickupDatesChange() {
    if (this.formControls.pickupDates.value === null) {
      this.formControls.pickupDatesRestrictions.disable();
      this.formControls.preferredPickupDate.disable();
    } else {
      this.formControls.pickupDatesRestrictions.enable();
      this.formControls.preferredPickupDate.enable();
      this.preferredPickupDateBegin = JSON.parse(JSON.stringify(this.createOrderForm.get(['pickupDates']).value)).begin;
      this.preferredPickupDateEnd = JSON.parse(JSON.stringify(this.createOrderForm.get(['pickupDates']).value)).end;
    }
  }

  onDeliveryDatesChange() {
    if (this.formControls.deliveryDates.value === null) {
      this.formControls.deliveryDatesRestrictions.disable();
      this.formControls.preferredDeliveryDate.disable();
    } else {
      this.formControls.deliveryDatesRestrictions.enable();
      this.formControls.preferredDeliveryDate.enable();
      this.preferredDeliveryDateBegin = JSON.parse(JSON.stringify(this.createOrderForm.get(['deliveryDates']).value)).begin;
      this.preferredDeliveryDateEnd = JSON.parse(JSON.stringify(this.createOrderForm.get(['deliveryDates']).value)).end;
    }
  }

  onAmountOnPickupKeyUp() {
    if (this.formControls.amountOnPickup.value === '') {
      this.formControls.paymentOnPickupMethod.setValue(null);
      this.formControls.paymentOnPickupMethod.disable();
    } else {
      this.formControls.paymentOnPickupMethod.enable();
    }
  }

  onAmountOnDeliveryKeyUp() {
    if (this.formControls.amountOnDelivery.value === '') {
      this.formControls.paymentOnDeliveryMethod.setValue(null);
      this.formControls.paymentOnDeliveryMethod.disable();
    } else {
      this.formControls.paymentOnDeliveryMethod.enable();
    }
  }

  onAutocompleteSelected(result: PlaceResult, zipCategory: string) {
    console.log('onAutocompleteSelected: ', result);
    // const postalCode = this.getPostalCode(result);
    // console.log(postalCode);
    // this.addressIsValid = true;
    // const place = autocomplete.getPlace();
    const address_components = result.address_components;
    const postalCode = this.extractFromAddress(address_components, 'postal_code');

    if (zipCategory === 'pickup') {
      this.pickupAddress = result.formatted_address;
      this.formControls.pickupZip.setValue('');
      if (postalCode !== null) {
        this.formControls.pickupZip.setValue(Number(postalCode));
      }
    } else if (zipCategory === 'delivery') {
      this.deliveryAddress = result.formatted_address;
      this.formControls.deliveryZip.setValue('');
      if (postalCode !== null) {
        this.formControls.deliveryZip.setValue(Number(postalCode));
      }
    } else if (zipCategory === 'broker') {
      this.brokerAddress = result.formatted_address;
      this.formControls.brokerZip.setValue('');
      if (postalCode !== null) {
        this.formControls.brokerZip.setValue(Number(postalCode));
      }
    }
  }

  onLocationSelected(location: Location, zipCategory: string) {
    console.log('onLocationSelected: ', location);
    const latitude: number = location.latitude;
    const longitude: number = location.longitude;
    if (zipCategory === 'pickup') {
      this.pickupLatitude = latitude;
      this.pickupLongitude = longitude;
    } else if (zipCategory === 'delivery') {
      this.deliveryLatitude = latitude;
      this.deliveryLongitude = longitude;
    } else if (zipCategory === 'broker') {
      this.brokerLatitude = latitude;
      this.brokerLongitude = longitude;
    }

    // let validationResult: any[] = [];
    // // const uri = encodeURI(this.pickupAddress);
    // const uri = this.pickupAddress;
    // const validation =
    // this.apiService.verifyAddress(uri).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
    //     if (data.length > 0) {
    //       validationResult = data[0];
    //     }
    //     console.log(validationResult);
    //   });
    this.verifyAddress(zipCategory);
    console.log(this.validationResult);
  }

  onAddressLostFocus(zipCategory: string) {
    // if (zipCategory === 'pickup') {
    // } else if (zipCategory === 'delivery') {
    // } else if (zipCategory === 'broker') {
    // }
    this.verifyAddress(zipCategory);
  }

  verifyAddress(zipCategory: string) {
    if (this.createOrderForm.get(zipCategory + 'Address').value.length !== 0) {
      this.pickupAddressValid = false;
    // if (zipCategory === 'pickup' && this.pickupAddress !== undefined) {
    //   this.apiService.verifyAddress(this.pickupAddress).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
    //   if (data.length > 0) {
    //     this.validationResult = data[0];
    //     // alert('Valid');
    //     this.pickupAddressValid = true;
    //   } else {
    //     // alert('Invalid');
    //     this.pickupAddressValid = false;
    //   }
    //   });
    // } else if (zipCategory === 'delivery' && this.deliveryAddress !== undefined) {
    //   this.apiService.verifyAddress(this.deliveryAddress).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
    //   if (data.length > 0) {
    //     this.validationResult = data[0];
    //     this.deliveryAddressValid = true;
    //   } else {
    //     this.deliveryAddressValid = false;
    //   }
    //   });
    // } else if (zipCategory === 'broker' && this.brokerAddress !== undefined) {
    //   this.apiService.verifyAddress(this.brokerAddress).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
    //     if (data.length > 0) {
    //       this.validationResult = data[0];
    //       this.brokerAddressValid = true;
    //     } else {
    //       this.brokerAddressValid = false;
    //     }
    //     });
    // }
    }
  }

  onGermanAddressMapped($event: GermanAddress) {
    console.log('onGermanAddressMapped', $event);
  }

  onZipChanged(zipCategory: string) {
    if (this.createOrderForm.get(zipCategory).value.length === 5) {
      const zipValue = this.createOrderForm.get(zipCategory).value;
      // this.apiService.verifyZip(zipValue).pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      //   if (data.length > 0 && data[0].zipcodes !== undefined && data[0].zipcodes.length > 0) {
      //     const latitude = data[0].zipcodes[0].latitude;
      //     const longitude = data[0].zipcodes[0].longitude;
      //     if (zipCategory === 'pickup') {
      //       this.pickupLatitude = latitude;
      //       this.pickupLongitude = longitude;
      //       this.pickupZipValid = true;
      //     } else if (zipCategory === 'delivery') {
      //       this.deliveryLatitude = latitude;
      //       this.deliveryLongitude = longitude;
      //       this.deliveryZipValid = true;
      //     } else if (zipCategory === 'broker') {
      //       this.brokerLatitude = latitude;
      //       this.brokerLongitude = longitude;
      //       this.brokerZipValid = true;
      //     }
      //   } else {
      //     if (zipCategory === 'pickup') {
      //       this.pickupZipValid = false;
      //     } else if (zipCategory === 'delivery') {
      //       this.deliveryZipValid = false;
      //     } else if (zipCategory === 'broker') {
      //       this.brokerZipValid = false;
      //     }
      //   }
      // });
    }
  }

  ///////////////////////////////////////// Methods /////////////////////////////////////////

  get formControls() {
    return this.createOrderForm.controls;
  }

  get pickupPhonez() {
    return this.formControls.pickupPhonez as FormArray;
  }

  get deliveryPhonez() {
    return this.formControls.deliveryPhonez as FormArray;
  }

  get shipperPhonez() {
    return this.formControls.shipperPhonez as FormArray;
  }

  createPhoneItem(): FormGroup {
    return this.formBuilder.group({
      phone: [''],
      note: ['']
    });
  }

  getVehicleYears() {
    return this.apiService.getVehicleYears();
  }

  getMakes() {
    return this.apiService.getMakes();
  }

  getModels() {
    return this.apiService.getModels(
      this.createOrderForm.get('vehicleMake').value
    );
  }

  // pickupDateAreProvided(): boolean {
  //   return JSON.stringify(this.createOrderForm.get('pickupDates').value) !== '{}';
  // }

  errorHandling(control: string, error: string) {
    // console.log(this.formControls.brokerEmail.errors.email);
    return this.formControls[control].hasError(error);
  }

  // logFormErrors() {
  //   console.log(this.formControls.formErrors);
  // }

  phonesAreEmpty(controls: FormArray) {
    let empty = true;
    for (const phone of controls.controls) {
      if (phone.get('phone').value !== '') {
        empty = false;
      }
    }
    return empty;
  }

  phoneIsNotCompleteValidator(phone: string) {
    // alert(phone);
    // const val = phone;
    // const vl = document.getElementById('pickupPhone1').getAttribute('val');
    // const phoneval = this.document.getElementById('pickupPhone1').value;
    // let vals = this.createOrderForm.get('pickupPhone1').value;
    // let vals = this.formControls.pickupPhone1.value;
    // const ph = this.pickupPhone1;

    const length = phone.replace(/[^0-9]/g, '').length;
    if (length !== 10) {
      return true;
    } else {
      return false;
    }
  }

  pricingIsProvided() {
    return (
      this.createOrderForm.get('carrierPay').value !== '' ||
      this.createOrderForm.get('amountOnPickup').value !== '' ||
      this.createOrderForm.get('amountOnDelivery').value !== ''
    );
  }

  public handleAddressChange(address: any) {
    this.formattedAddress = address.formatted_address;
    console.log(address);
    console.log(this.formattedAddress);
  }

  // getPostalCode(result: PlaceResult) {
  //   JSON.stringify(result.address_components).forEach(component => {
  //     if (Number(component.types.indexOf('postal_code')) > -1) {
  //       return JSON.stringify(component['short_name']);
  //     }
  //   });
  //   return '';
  // }

  extractFromAddress(components: google.maps.GeocoderAddressComponent[], type: string) {
    return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || null;
  }

  closeDialog() {
    this.createOrderForm.reset();
    this.dialogRef.close();
    this.router.navigate(['/orders']);
  }

  // addressLostFocus() {
  //   alert('Ok');
  // }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
