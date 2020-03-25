import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { OrderComponent } from './order/order.component';
// import { OrderListComponent } from './order-list/order-list.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
import { OptionsComponent } from './component/options/options.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
// import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';

import { TextMaskModule } from 'angular2-text-mask';
import { DigitOnlyModule } from '@uiowa/digit-only';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
// import { AgmCoreModule } from '@agm/core';
// import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
// import { OrderDialogComponent } from './order-dialog/order-dialog.component';
// import { LoadBoardComponent } from './load-board/load-board.component';
// import { SearchFiltersComponent } from './search-filters/search-filters.component';
// import { SearchFiltersDialogComponent } from './search-filters-dialog/search-filters-dialog.component';
// import { AskToBookComponent } from './ask-to-book/ask-to-book.component';
// import { AskToBookDialogComponent } from './ask-to-book-dialog/ask-to-book-dialog.component';

// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { OrdersLoadBoardModule } from './component/module/book-loads/orders-load-board.module';
import { OrdersManageModule } from './component/module/manage-orders/orders-manage.module';

import { JwtModule} from '@auth0/angular-jwt';
import { LoginComponent } from './component/module/auth-components/login/login.component';
import { RegisterComponent } from './component/module/auth-components/register/register.component';
import { InterceptorService } from './service/interceptor.service';
import { DriversListDialogComponent } from './component/drivers-list-dialog/drivers-list-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    // OrderComponent,
    // OrderListComponent,
    // DashboardComponent,
    OptionsComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    DriversListDialogComponent
    // OrderDialogComponent

    // LoadBoardComponent,
    // SearchFiltersComponent,
    // SearchFiltersDialogComponent,
    // AskToBookComponent,
    // AskToBookDialogComponent
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
    // MatDatepickerModule,
    // MatNativeDateModule,

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

    AgmCoreModule.forRoot(),

    OrdersLoadBoardModule,
    OrdersManageModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
                return localStorage.getItem('access_token');
        }
        // whitelistedDomains: [
        //   'http://localhost:4200/'
        // ],
        // blacklistedRoutes: [
        //   ''
        // ]
      }
    })

    // LoadBoardComponent,
    // SearchFiltersComponent,
    // SearchFiltersDialogComponent,
    // AskToBookComponent,
    // AskToBookDialogComponent
  ],
  // entryComponents: [
  //   OrderComponent
    // AskToBookComponent
    // LoadBoardComponent
  // ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
