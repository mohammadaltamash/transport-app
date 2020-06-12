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
import { OrdersLoadBoardModule } from '../book-loads/orders-load-board.module';
import { BookOrderDialogComponent } from './book-order-dialog/book-order-dialog.component';
import { InviteOrderDialogComponent } from './invite-order-dialog/invite-order-dialog.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppModule } from '../../../app.module';
import { AppComponent } from '../../../app.component';
import { AppRoutingModule } from '../../../app-routing.module';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
  declarations: [
    DashboardComponent,
    OrderComponent,
    OrderDialogComponent,
    OrderListComponent,
    BookOrderDialogComponent,
    InviteOrderDialogComponent
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
    MatGoogleMapsAutocompleteModule,
    ScrollingModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    AppRoutingModule,
    RichTextEditorAllModule
  ],
  providers: [AppComponent],
  entryComponents: [
    OrderComponent,
    OrderListComponent,
    DriversListDialogComponent
  ]
})
export class OrdersManageModule { }
