import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../order';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of } from 'rxjs';

import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  zipMask = [/\d/, /\d/, /\d/, /\d/, /\d/];
  phoneMask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // @ViewChild('pickupPhone1') phone1Element: ElementRef;
  document: Document;
  // @ViewChild('pickupPhone1', {static: false}) public pickupPhone1: ElementRef;
  @ViewChild('pickupPhone1') pickupPhone1: ElementRef;

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

  paymentTermBegins: string[] = [
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
  // formErrors = {};

  createOrderForm: FormGroup;

  ///////////////////////////////////////// Callbacks /////////////////////////////////////////

  constructor(
    @Inject(DOCUMENT) document,
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {
    this.validationMessages = {
      // brokerOrderId: {
      //   required: '<strong>Broker Order ID</strong> is mandatory'
      // },
      required: 'Please fill out',
      phone: 'Atlease one phone is required',
      email: 'Email is invalid'
    };

    // this.formErrors = {
    //   brokerOrderId: ''
    // };
    this.document = document;
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
      pickupDates: ['', Validators.required],
      // pickupDates: {},
      pickupDatesRestrictions: '',

      // Delivery Contact & Location
      deliveryContactName: '',
      deliveryCompanyName: '',
      deliveryAddress: ['', Validators.required],
      deliveryZip: ['', [Validators.required, Validators.maxLength(5)]],
      deliveryPhonez: new FormArray([this.createPhoneItem()]),
      deliveryPhones: {},
      deliverySignatureNotRequired: '',
      // deliveryDates: [{}, Validators.required],
      deliveryDates: ['', Validators.required],
      deliveryDatesRestrictions: '',

      // Add New Vehicle
      vehicleYear: '',
      vehicleMake: ['', Validators.required],
      vehicleModel: '',
      vehicleAutoType: '',
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
    this.formControls.deliveryDatesRestrictions.disable();
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

  changeModels() {
    this.vehicleModels = this.getModels();
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
    } else {
      this.formControls.pickupDatesRestrictions.enable();
    }
  }

  onDeliveryDatesChange() {
    if (this.formControls.deliveryDates.value === null) {
      this.formControls.deliveryDatesRestrictions.disable();
    } else {
      this.formControls.deliveryDatesRestrictions.enable();
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

  onSubmit() {
    // alert(this.document.getElementById('pickupPhone1').value);
    // alert(this.pickupPhone1.nativeElement);
    // const val = document.getElementById('pickupPhone1');
    // alert(this.createOrderForm.get('phone').value);
    // const pickupPhone1 = this.formControls.pickupPhone1.value;
    if (this.createOrderForm.hasError) {
      // alert('Form has errors');
      // console.log(this.createOrderForm.hasError);
      // return;
    }
    if (this.createOrderForm.valid) {
      const pickupPhonesMap = new Map();
      for (const phone of this.pickupPhonez.controls) {
        if (phone.get('phone').value !== '') {
          pickupPhonesMap[phone.get('phone').value] = phone.get('note').value;
        }
      }
      const deliveryPhonesMap = new Map();
      for (const phone of this.deliveryPhonez.controls) {
        if (phone.get('phone').value !== '') {
          deliveryPhonesMap[phone.get('phone').value] = phone.get('note').value;
        }
      }
      const shipperPhonesMap = new Map();
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

      this.httpClient
        .post<Order>(
          'http://localhost:8080/transportapp/demo/order/create',
          JSON.stringify(o),
          {
            headers: new HttpHeaders({
              'Content-Type': 'application/json'
            })
          }
        )
        .subscribe(
          // data => console.log(data.deliveryDates.endDate),
          res => console.log(res),
          err => console.log(err)
        );

      console.log(
        '>>>>>' + JSON.stringify(this.createOrderForm.get('pickupPhonez').value)
      );
      console.log(
        '>>>>>' +
          JSON.stringify(this.createOrderForm.get('vehicleAutoType').value)
      );
      console.log(this.apiService.getVehicleYears()[0]);
      console.log(this.apiService.getModels('Fiat Chrysler Automobiles'));
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
}
