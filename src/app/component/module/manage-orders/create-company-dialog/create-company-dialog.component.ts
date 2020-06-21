import { Component, OnInit, Optional, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/service/api.service';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { Utilities } from 'src/app/helper/utilities';
import { Company } from 'src/app/model/company';

@Component({
  selector: 'app-create-company-dialog',
  templateUrl: './create-company-dialog.component.html',
  styleUrls: ['./create-company-dialog.component.scss']
})
export class CreateCompanyDialogComponent implements OnInit {
  companyForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<CreateCompanyDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private utilities: Utilities
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
    console.log(company);
    this.apiService.createCompany(company).subscribe(comp => {
      this.utilities.showSuccess('Company added', 'Company');
      this.dialogRef.close({ created: true });
    });
  }

  onCloseClick() {
    this.dialogRef.close({ created: false });
  }

  // errorHandling(control: string, error: string) {
  //   // console.log(this.formControls.brokerEmail.errors.email);
  //   return this.formControls[control].hasError(error);
  // }
}
