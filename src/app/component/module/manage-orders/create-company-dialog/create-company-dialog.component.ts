import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Utilities } from 'src/app/helper/utilities';
import { Company } from 'src/app/model/company';
import { ErrorHandler } from '../../../../helper/error_handler';
import PlaceResult = google.maps.places.PlaceResult;
import { Location } from '@angular-material-extensions/google-maps-autocomplete';

@Component({
  selector: 'app-create-company-dialog',
  templateUrl: './create-company-dialog.component.html',
  styleUrls: ['./create-company-dialog.component.scss']
})
export class CreateCompanyDialogComponent implements OnInit {
  companyForm: FormGroup;
  country = 'us';
  address: string;
  latitude: number;
  longitude: number;

  constructor(
    private dialogRef: MatDialogRef<CreateCompanyDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private utilities: Utilities,
    public errorHandler: ErrorHandler
  ) {}

  ngOnInit(): void {
    this.companyForm = this.formBuilder.group({
      companyName: '',
      address: '',
      addressState: '',
      zip: '',
      // latitude: '',
      // longitude:'',
      phones: {},
      companyEmail: ['', [Validators.required, Validators.email]],
      contactName: ''
    });
  }

  onSubmit() {
    const company: Company = this.companyForm.value;
    company.address = this.address;
    company.latitude = this.latitude;
    company.longitude = this.longitude;
    console.log(company);
    this.apiService.createCompany(company).subscribe(comp => {
      this.utilities.showSuccess('Company added', 'Company');
      this.dialogRef.close({ created: true });
    });
  }

  onCloseClick() {
    this.dialogRef.close({ created: false });
  }

  get formControls() {
    return this.companyForm.controls;
  }

  // Address

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
    // const postalCode = this.getPostalCode(result);
    // console.log(postalCode);
    // this.addressIsValid = true;
    // const place = autocomplete.getPlace();
    const address_components = result.address_components;
    const postalCode = this.extractFromAddress(
      address_components,
      'postal_code'
    );

    this.address = result.formatted_address;
    this.formControls.zip.setValue('');
    if (postalCode !== null) {
      this.formControls.zip.setValue(Number(postalCode));
    }
  }

  extractFromAddress(
    components: google.maps.GeocoderAddressComponent[],
    type: string
  ) {
    return (
      components
        .filter(component => component.types.indexOf(type) === 0)
        .map(item => item.long_name)
        .pop() || null
    );
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

  // errorHandling(control: string, error: string) {
  //   // console.log(this.formControls.brokerEmail.errors.email);
  //   return this.formControls[control].hasError(error);
  // }
}
