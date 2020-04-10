import {
  Component,
  OnInit,
  Inject,
  Optional
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

@Component({
  selector: 'app-ask-to-book',
  templateUrl: './ask-to-book.component.html',
  styleUrls: ['./ask-to-book.component.scss']
  // encapsulation: ViewEncapsulation.None,
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

  offerValidity: string[] = ['1 hr', '4 hrs', '12 hrs', '24 hrs'];

  askToBookForm: FormGroup;
  pickupStart = new Date();
  pickupEnd = new Date();
  deliveryStart = new Date();
  deliveryEnd = new Date();
  selectedDate = new Date();
  date: FormControl;
  // dateClass: string;

  constructor(
    private dialogRef: MatDialogRef<AskToBookComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private utilities: Utilities
  ) {
    this.pickupEnd.setDate(this.pickupEnd.getDate() + 1);
    this.pickupStart.setDate(this.pickupStart.getDate() - 5);
    this.selectedDate.setDate(this.selectedDate.getDate() - 2);
    this.date = new FormControl(this.selectedDate);
  }

  ngOnInit() {
    this.askToBookForm = this.formBuilder.group({
      // id: '',
      brokerOrderId: '',
      carrierPay: [this.data.carrierPay, Validators.required],

      daysToPay: '',
      paymentTermBegins: [this.data.paymentTermBegins],
      pickupDates: [this.data.pickupDates[0], Validators.required],
      deliveryDates: [this.data.deliveryDates, Validators.required],
      offerReason: '',
      offerValidity: ''
    });
  }

  onSubmit(orderId: number) {
    // this.askToBookForm.setValue(order);
    // if (this.askToBookForm.invalid) {
    //   return;
    // }
    const o: Order = this.askToBookForm.value;
    o.id = orderId;
    o.orderStatus = environment.ASSIGNED_ORDER;
    o.askedToBook = this.authenticationService.currentUserValue.id;
    this.apiService.updateOrder(o)
        .subscribe(
          // data => console.log(data.deliveryDates.endDate),
          res => console.log(res),
          err => console.log(err)
        );
    this.utilities.openSnackBar('Order has been asked to be booked', '');
    // this.askToBookForm.reset();

    this.dialogRef.close();
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
}
