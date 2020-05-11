import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { ApiService } from '../../../../service/api.service';
import { Order } from '../../../../model/order';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AskToBookDialogComponent } from '../ask-to-book-dialog/ask-to-book-dialog.component';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog
} from '@angular/material/dialog';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/service/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Constants } from 'src/app/model/constants';
import { PagedOrders } from 'src/app/model/paged-orders';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CommonModelService } from 'src/app/service/common-model.service';
import { CityZipLatLong } from 'src/app/model/city-zip-lat-long';
import { LatitudeLongitudeDistanceRefs } from 'src/app/model/latitude-longitude-distance-refs';

@Component({
  selector: 'app-load-board',
  templateUrl: './load-board.component.html',
  styleUrls: ['./load-board.component.scss']
})
export class LoadBoardComponent implements OnInit {
  @ViewChild(AskToBookDialogComponent) askToBookDialogComponent: {
    openDialog: (arg0: Order) => void;
  };

  config: any;
  orders: Order[] = [];
  selectedOrder: Order; // ?
  selectedItem: number; // ?
  selectedOriginCities: CityZipLatLong[] = [];
  selectedDestinationCities: CityZipLatLong[] = [];
  // selectedOriginCitiesRadius = [];
  // selectedDestinationCitiesRadius = [];

  isSearching = false;
  // bookDialog: AskToBookDialogComponent;
  destroy$: Subject<boolean> = new Subject<boolean>();

  searchForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private appComponent: AppComponent,
    private commonModelService: CommonModelService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public authenticationService: AuthenticationService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    public filterDialog: MatDialog
  ) {
    // this.bookDialog = new AskToBookDialogComponent(null);
  }

  ngOnInit() {
    this.config = {
      currentPage: 0,
      itemsPerPage: Constants.ORDERS_PER_PAGE,
      totalItems: 0
    };
    this.spinner.show();
    // this.apiService
    //   .getOrdersByStatusIn(environment.NEW_ORDER, 0, Constants.ORDERS_PER_PAGE)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((data: any[]) => {
    //     this.spinner.hide();
    //     console.log(data);
    //     this.orders = data;
    //     // this.orders.push(data[22]);
    //     // this.orders.push(data[23]);
    //     // this.orders.push(data[24]);
    //   });
    this.fetchOrders(0);
    this.searchForm = this.formBuilder.group({
      searchText: ''
    });
  }

  onSubmitSearch() {
    if (this.searchForm.value.searchText.trim() === '') {
      return;
    }
    this.isSearching = true;
    this.config.currentPage = 0;
    this.fetchOrders(0);
  }

  onSearchChanged() {
    if (this.searchForm.value.searchText.trim() === '') {
      this.isSearching = false;
      this.pageChange(1);
    }
  }

  showDialog(order: Order, index: number) {
    // this.bookDialog.openDialog();
    const result = this.askToBookDialogComponent.openDialog(order);
    this.selectedItem = index;
    this.appComponent.setCurrentOrderValue(order);
  }

  showFiltersDialog() {
    this.commonModelService.openFilterDialog().subscribe(data => {
      console.log(data);
      if (data.apply) {
        const cityZipFetch = localStorage.getItem('cityZipFetchOrigin');
        if (cityZipFetch === 'true') {
          this.selectedOriginCities = JSON.parse(
            localStorage.getItem('selectedOriginCities')
          );
          this.selectedDestinationCities = JSON.parse(
            localStorage.getItem('selectedDestinationCities')
          );
          const pickupLatLongArray = [];
          this.selectedOriginCities.forEach(item => {
            const latLong = {
              latitude: item.latitude,
              longitude: item.longitude,
              distance: item.distance
            };
            pickupLatLongArray.push(latLong);
          });
          const deliveryLatLongArray = [];
          this.selectedDestinationCities.forEach(item => {
            const latLong = {
              latitude: item.latitude,
              longitude: item.longitude,
              distance: item.distance
            };
            deliveryLatLongArray.push(latLong);
          });

          this.spinner.show();
          const latitudeLongitudeRefs: LatitudeLongitudeDistanceRefs = new LatitudeLongitudeDistanceRefs();
          // const latLong1 = {
          //   latitude: 42.997075,
          //   longitude: -103.074280
          // };
          // pickupLatLongArray.push(latLong1);
          // const latLong2 = {
          //   latitude: 43.055871742848105,
          //   longitude: -103.03584344219247
          // };
          // pickupLatLongArray.push(latLong2);
          // const latLong3 = {
          //   latitude: 42.997075,
          //   longitude: -103.074280
          // };
          // deliveryLatLongArray.push(latLong3);
          // const latLong4 = {
          //   latitude: 43.055871742848105,
          //   longitude: -103.03584344219247
          // };
          // deliveryLatLongArray.push(latLong4);

          latitudeLongitudeRefs.pickupLatLongs = pickupLatLongArray;
          latitudeLongitudeRefs.deliveryLatLongs = deliveryLatLongArray;
          if (
            latitudeLongitudeRefs.pickupLatLongs.length > 0 ||
            latitudeLongitudeRefs.deliveryLatLongs.length > 0
          ) {
            this.apiService
              .getCircularDistance(
                latitudeLongitudeRefs,
                1000,
                0,
                this.config.itemsPerPage
              )
              // .pipe(takeUntil(this.destroy$))
              .subscribe((pagedOrders: PagedOrders) => {
                // this.all = data.length;
                this.spinner.hide();
                // console.log(data);
                this.orders = pagedOrders.orders;
                this.config.totalItems = pagedOrders.totalItems;
                // this.all = data.totalItems;
                if (pagedOrders.orders.length > 0) {
                  this.selectedOrder = this.orders[0];
                }

                // localStorage.removeItem('selectedOriginCities');
                // localStorage.removeItem('selectedDestinationCities');
              });
            // } else {
            //   this.fetchOrders(0);
          }
        } else {
          const selectedOriginStates: [] = JSON.parse(localStorage.getItem('selectedOriginStates'));
          const selectedOriginStatesCsv = selectedOriginStates.join(', ');
          this.spinner.show();
          this.apiService
          .getOrdersByStatesIn(selectedOriginStatesCsv, '', selectedOriginStatesCsv, 0, this.config.itemsPerPage)
          // .pipe(takeUntil(this.destroy$))
          .subscribe((pagedOrders: PagedOrders) => {
            this.spinner.hide();
            this.orders = pagedOrders.orders;
            this.config.totalItems = pagedOrders.totalItems;
            if (pagedOrders.orders.length > 0) {
              this.selectedOrder = this.orders[0];
            }
          });
        }
      }
      if (
        localStorage.getItem('selectedOriginCities') === null ||
        JSON.parse(localStorage.getItem('selectedOriginCities')).length === 0 ||
        localStorage.getItem('selectedDestinationCities') === null ||
          JSON.parse(localStorage.getItem('selectedDestinationCities')).length >
            0
      ) {
        this.fetchOrders(0);
        this.config.currentPage = 0;
      }
    });
  }

  shouldDisplayAddress(order: Order) {
    return (
      order.createdBy !== null &&
      order.createdBy.email ===
        this.authenticationService.currentUserValue.email
    );
  }

  pageChange(newPage: number) {
    this.fetchOrders(newPage - 1);
    this.config.currentPage = newPage;
  }

  fetchOrders(pageNumber: number) {
    this.selectedOrder = null;
    this.spinner.show();
    if (this.isSearching) {
      // this.spinner.show();
      this.apiService
        .searchOrders(
          environment.NEW_ORDER,
          this.searchForm.value.searchText.trim(),
          pageNumber,
          this.config.itemsPerPage
        )
        .subscribe((data: PagedOrders) => {
          this.spinner.hide();
          console.log(data);
          this.orders = data.orders;
          this.config.totalItems = data.totalItems;
          if (data.totalItems > 0) {
            this.selectedOrder = this.orders[0];
          }
        });
    } else if (
      (localStorage.getItem('selectedOriginCities') !== null &&
        JSON.parse(localStorage.getItem('selectedOriginCities')).length > 0) ||
      (localStorage.getItem('selectedDestinationCities') !== null &&
        JSON.parse(localStorage.getItem('selectedDestinationCities')).length >
          0)
    ) {
      this.selectedOriginCities = JSON.parse(
        localStorage.getItem('selectedOriginCities')
      );
      this.selectedDestinationCities = JSON.parse(
        localStorage.getItem('selectedDestinationCities')
      );
      const pickupLatLongArray = [];
      this.selectedOriginCities.forEach(item => {
        const latLong = {
          latitude: item.latitude,
          longitude: item.longitude,
          distance: item.distance
        };
        pickupLatLongArray.push(latLong);
      });
      const deliveryLatLongArray = [];
      this.selectedDestinationCities.forEach(item => {
        const latLong = {
          latitude: item.latitude,
          longitude: item.longitude,
          distance: item.distance
        };
        deliveryLatLongArray.push(latLong);
      });
      const latitudeLongitudeRefs: LatitudeLongitudeDistanceRefs = new LatitudeLongitudeDistanceRefs();
      // const latLong1 = {
      //   latitude: 42.997075,
      //   longitude: -103.074280
      // };
      // pickupLatLongArray.push(latLong1);
      // const latLong2 = {
      //   latitude: 43.055871742848105,
      //   longitude: -103.03584344219247
      // };
      // pickupLatLongArray.push(latLong2);
      // const latLong3 = {
      //   latitude: 42.997075,
      //   longitude: -103.074280
      // };
      // deliveryLatLongArray.push(latLong3);
      // const latLong4 = {
      //   latitude: 43.055871742848105,
      //   longitude: -103.03584344219247
      // };
      // deliveryLatLongArray.push(latLong4);

      latitudeLongitudeRefs.pickupLatLongs = pickupLatLongArray;
      latitudeLongitudeRefs.deliveryLatLongs = deliveryLatLongArray;
      this.apiService
        .getCircularDistance(
          latitudeLongitudeRefs,
          1000,
          pageNumber,
          this.config.itemsPerPage
        )
        // .pipe(takeUntil(this.destroy$))
        .subscribe((pagedOrders: PagedOrders) => {
          // this.all = data.length;
          this.spinner.hide();
          // console.log(data);
          this.orders = pagedOrders.orders;
          this.config.totalItems = pagedOrders.totalItems;
          // this.all = data.totalItems;
          if (pagedOrders.orders.length > 0) {
            this.selectedOrder = this.orders[0];
          }
        });
    } else {
      this.apiService
        .getOrdersByStatusIn(
          environment.NEW_ORDER,
          pageNumber,
          this.config.itemsPerPage
        )
        // .pipe(takeUntil(this.destroy$))
        .subscribe((data: PagedOrders) => {
          // this.all = data.length;
          this.spinner.hide();
          console.log(data);
          this.orders = data.orders;
          this.config.totalItems = data.totalItems;
          // this.all = data.totalItems;
          if (data.orders.length > 0) {
            this.selectedOrder = this.orders[0];
          }
        });
    }
  }

  matBadgeCount() {
    let count = 0;
    if (
      localStorage.getItem('selectedOriginCities') !== null &&
      JSON.parse(localStorage.getItem('selectedOriginCities')).length > 0
    ) {
      count += JSON.parse(localStorage.getItem('selectedOriginCities')).length;
    }
    if (
      localStorage.getItem('selectedDestinationCities') !== null &&
      JSON.parse(localStorage.getItem('selectedDestinationCities')).length > 0
    ) {
      count += JSON.parse(localStorage.getItem('selectedDestinationCities'))
        .length;
    }
    return count;
  }
}
