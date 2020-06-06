import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ErrorHandler {
  validationMessages = {};

  constructor() {
    this.validationMessages = {
      // brokerOrderId: {
      //   required: '<strong>Broker Order ID</strong> is mandatory'
      // },
      required: 'Please fill out',
      requiredItem: 'Please select',
      invalidZip: 'Invalid zipcode',
      // phone: 'Atlease one phone is required',
      email: 'Email is invalid',
      invalidCredentials: 'Invalid email or password',
      timedOut: 'Signed out on 15 minutes inactivity!'
    };
  }

  public handleError(controls: { [x: string]: { hasError: (arg0: string) => void; }; }, control: string, error: string) {
    return controls[control].hasError(error);
  }
}
