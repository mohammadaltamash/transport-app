import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OptionsComponent } from './options/options.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MatDatepickerModule } from '@angular/material';

import { TextMaskModule } from 'angular2-text-mask';
import { DigitOnlyModule } from '@uiowa/digit-only';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
// import { AgmCoreModule } from '@agm/core';
// import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { OrderDialogComponent } from './order-dialog/order-dialog.component';

// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    OrderListComponent,
    DashboardComponent,
    OptionsComponent,
    FooterComponent,
    OrderDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    BrowserAnimationsModule,

    FormsModule,
    MaterialModule,

    SatDatepickerModule,
    SatNativeDateModule,
    MatDatepickerModule,

    // FontAwesomeModule
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDadXWhxzrxjqRs9ID3LqnuCUoA5vUJ_VM',
      libraries: ['places']
    }),
    MatGoogleMapsAutocompleteModule,

    TextMaskModule,
    DigitOnlyModule,

    GooglePlaceModule,

    ScrollingModule,

    MatGoogleMapsAutocompleteModule,

    AgmCoreModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
