import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCalendarCellCssClasses } from '@angular/material';
import { Order } from '../../order';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-ask-to-book',
  templateUrl: './ask-to-book.component.html',
  styleUrls: ['./ask-to-book.component.css']
})
export class AskToBookComponent implements OnInit {

  daysToPay: string[] = [
    'Immediately',
    '2 Bus. Days (Quick Pay)',
    '5 Bus. Dys',
    '10 Bus. Days',
    '15 Bus. Days',
    '30 Bus. Days'
  ];

  paymentTermBegins: string[] = [
    'Pickup',
    'Delivery',
    'Receiving a uShip code',
    'Receiving a signed BOL'
  ];

  offerReason: string[] = [
    'Not applicable',
    'Carrier pay is low',
    'Pick-up dates don\'t work for me',
    'Delivery dates don\'t work for me',
    'Do not agree with the payment terms',
    'Other'
  ];

  offerValidity: string[] = [
    '1 hr',
    '4 hrs',
    '12 hrs',
    '24 hrs'
  ];

  askToBookForm: FormGroup;
  tomorrow = new Date();
  yesterday = new Date();
  selectedDate = new Date();
  date: FormControl;
  // dateClass: string;
  
  constructor(public dialogRef: MatDialogRef<AskToBookComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
              private formBuilder: FormBuilder) {
                
                this.tomorrow.setDate(this.tomorrow.getDate() + 1);
                this.yesterday.setDate(this.tomorrow.getDate() - 5);
                this.selectedDate.setDate(this.tomorrow.getDate() - 2);
                this.date = new FormControl(this.selectedDate);
                // this.dateClass = 'example-custom-date-class';
              }


  ngOnInit() {
    this.askToBookForm = this.formBuilder.group({
      // id: '',
      brokerOrderId: ['', Validators.required],
      carrierPay: [this.data.carrierPay, Validators.required],

      daysToPay: '',
      paymentTermBegins: [this.data.paymentTermBegins],
      pickupDates: ['', Validators.required],
      deliveryDates: [this.data.deliveryDates, Validators.required],
      offerReason: '',
      offerValidity: ''
    });
  }

  onSubmit() {
    this.askToBookForm.reset();
    this.dialogRef.close();
  }

  dateClass = (d: Date): MatCalendarCellCssClasses => {
    const date = d.getDate();

    // Highlight the 1st and 20th day of each month.
    // return (date === 1 || date === 20) ? 'example-custom-date-class' : '';
    return 'example-custom-date-class';
  }

}
