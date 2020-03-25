import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { TextMaskModule } from 'angular2-text-mask';
import { DigitOnlyModule } from '@uiowa/digit-only';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderComponent } from './order/order.component';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { OrderListComponent } from './order-list/order-list.component';
import { DriversListDialogComponent } from '../../drivers-list-dialog/drivers-list-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    OrderComponent,
    OrderDialogComponent,
    OrderListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,

    SatDatepickerModule,
    SatNativeDateModule,
    TextMaskModule,
    DigitOnlyModule,
    MatGoogleMapsAutocompleteModule
  ],
  entryComponents: [
    OrderComponent,
    OrderListComponent,
    DriversListDialogComponent
  ]
})
export class OrdersManageModule { }
