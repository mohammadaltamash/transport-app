import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { User } from '../../../../model/user';
import { AuthenticationService } from '../../../../service/authentication.service';
import PlaceResult = google.maps.places.PlaceResult;
import {Location, Appearance} from '@angular-material-extensions/google-maps-autocomplete';
import { ErrorHandler } from '../../../../helper/error_handler';
import { Utilities } from 'src/app/helper/utilities';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  phoneMask = ['(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  registerForm: FormGroup;
  country = 'us';
  address: string;
  latitude: number;
  longitude: number;
  // invalidZip: boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();

  types: string[] = [
    'BROKER', 'CARRIER', 'DRIVER'
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private utilities: Utilities,
    public errorHandler: ErrorHandler
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      fullName: '',
      password: ['', Validators.required],
      companyName: '',
      address: '',
      zip: ['', Validators.maxLength(5)],
      phonez: new FormArray([this.createPhoneItem()]),
      phones: {},
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }
    // const phonesMap = {};
    // for (const phone of this.phonez.controls) {
    //   if (phone.get('phone').value !== '') {
    //     phonesMap[phone.get('phone').value] = phone.get('note').value;
    //   }
    // }

    const user: User = this.registerForm.value;
    user.address = this.address;
    user.latitude = this.latitude;
    user.longitude = this.longitude;
    // user.phones = phonesMap;
    for (const phone of this.phonez.controls) {
      // if (phone.get('phone').value !== '') {
      //   phonesMap[phone.get('phone').value] = phone.get('note').value;
      // }
      // user.phones.push(phone.get('phone').value);
    }
    this.authenticationService
      .register(this.registerForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: boolean) => {
        console.log(data);
        if (data) {
          // ${this.registerForm.get('email')}
          this.utilities.showSuccess(`User registered successfully!`, 'Registration');
          this.router.navigate(['/login']);
        }
      });
  }

  get formControls() {
    return this.registerForm.controls;
  }

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
    // const postalCode = this.getPostalCode(result);
    // console.log(postalCode);
    // this.addressIsValid = true;
    // const place = autocomplete.getPlace();
    const address_components = result.address_components;
    const postalCode = this.extractFromAddress(address_components, 'postal_code');


    this.address = result.formatted_address;
    this.formControls.zip.setValue('');
    if (postalCode !== null) {
        this.formControls.zip.setValue(Number(postalCode));
    }

  }

  extractFromAddress(components: google.maps.GeocoderAddressComponent[], type: string) {
    return components.filter((component) => component.types.indexOf(type) === 0).map((item) => item.long_name).pop() || null;
  }

  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    const latitude: number = location.latitude;
    const longitude: number = location.longitude;
    this.latitude = latitude;
    this.longitude = longitude;
    // this.verifyAddress(zipCategory);
    // console.log(this.validationResult);
  }

  onAddressLostFocus() {
    // this.verifyAddress(zipCategory);
  }

  onZipChanged() {
    // if (this.registerForm.get('zip').value.length === 5) {
    // }
  }

  createPhoneItem(): FormGroup {
    return this.formBuilder.group({
      phone: ['']
    });
  }

  get phonez() {
    return this.formControls.phonez as FormArray;
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
}
