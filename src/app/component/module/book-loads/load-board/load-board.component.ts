import { Component, OnInit, Inject, Optional, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
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
import { SearchFiltersDialogComponent } from '../search-filters-dialog/search-filters-dialog.component';
import { MapHelper } from 'src/app/helper/map_helper';

@Component({
  selector: 'app-load-board',
  templateUrl: './load-board.component.html',
  styleUrls: ['./load-board.component.scss']
})
export class LoadBoardComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;
  map: google.maps.Map;
  @ViewChild(AskToBookDialogComponent) askToBookDialogComponent: {
    openDialog: (arg0: Order, arg1: boolean) => void;
  };

  config: any;
  orders: Order[] = [];
  selectedOrder: Order; // ?
  selectedItem: number; // ?
  selectedOriginCities: CityZipLatLong[] = [];
  selectedDestinationCities: CityZipLatLong[] = [];
  markers: any[];
  // selectedOriginCitiesRadius = [];
  // selectedDestinationCitiesRadius = [];

  isSearching = false;
  mapDisplayed: boolean;
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
    public filterDialog: MatDialog,
    private mapHelper: MapHelper,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // this.bookDialog = new AskToBookDialogComponent(null);
    // this.orders.forEach(order => {
    //   this.markers.push({
    //     latitude: order.pickupLatitude,
    //     longitude: order.pickupLongitude,
    //     title: 'Pickup location',
    //     icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
    //   });
    //   this.markers.push({
    //     latitude: order.deliveryLatitude,
    //     longitude: order.deliveryLongitude,
    //     title: 'Drop off location',
    //     icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png'
    //   });
    // });
    const shouldDisplay = localStorage.getItem('mapDisplayed');
    this.mapDisplayed = shouldDisplay !== null && shouldDisplay === 'true' ? true : false;
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

  ngAfterViewInit(): void {
    // this.initializeMap();
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

  showDialog(order: Order, index: number, requestBooking: boolean) {
    // this.bookDialog.openDialog();
    const result = this.askToBookDialogComponent.openDialog(order, requestBooking);
    this.selectedItem = index;
    this.appComponent.setCurrentOrderValue(order);
  }

  showFiltersDialog() {
    this.commonModelService.openFilterDialog().subscribe(data => {
      console.log(data);
      if (data.apply) {
        this.fetchFilteredOrders(0);
      }
    });
  }

  fetchFilteredOrders(pageNumber: number) {
    this.spinner.show();
    const cityZipFetchOrigin = localStorage.getItem('cityZipFetchOrigin');
    const cityZipFetchDestination = localStorage.getItem('cityZipFetchDestination');
    const latitudeLongitudeRefs: LatitudeLongitudeDistanceRefs = new LatitudeLongitudeDistanceRefs();
    if (cityZipFetchOrigin === 'true' || cityZipFetchDestination === 'true') {
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

          // this.spinner.show();
          // const latitudeLongitudeRefs: LatitudeLongitudeDistanceRefs = new LatitudeLongitudeDistanceRefs();
          // latitudeLongitudeRefs = new LatitudeLongitudeDistanceRefs();
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
          // if (
          //   latitudeLongitudeRefs.pickupLatLongs.length > 0 ||
          //   latitudeLongitudeRefs.deliveryLatLongs.length > 0
          // ) {
          //   this.apiService
          //     .getFilteredOrders(
          //       latitudeLongitudeRefs,
          //       1000,
          //       0,
          //       this.config.itemsPerPage
          //     )
          //     // .pipe(takeUntil(this.destroy$))
          //     .subscribe((pagedOrders: PagedOrders) => {
          //       this.spinner.hide();
          //       this.orders = pagedOrders.orders;
          //       this.config.totalItems = pagedOrders.totalItems;
          //       if (pagedOrders.orders.length > 0) {
          //         this.selectedOrder = this.orders[0];
          //       }
          //     });
          // }
        }
    let selectedOriginStatesCsv = null;
    if (cityZipFetchOrigin === 'false') {
          const selectedOriginStates: [] = JSON.parse(localStorage.getItem('selectedOriginStates'));
          // const selectedOriginStatesCsv = selectedOriginStates.join(', ');
          if (selectedOriginStates.length > 0) {
            selectedOriginStatesCsv = selectedOriginStates.join(', ');
          }
          // this.spinner.show();
          // this.apiService
          // .getOrdersByStatesIn(selectedOriginStatesCsv, '', selectedOriginStatesCsv, 0, this.config.itemsPerPage)
          // // .pipe(takeUntil(this.destroy$))
          // .subscribe((pagedOrders: PagedOrders) => {
          //   this.spinner.hide();
          //   this.orders = pagedOrders.orders;
          //   this.config.totalItems = pagedOrders.totalItems;
          //   if (pagedOrders.orders.length > 0) {
          //     this.selectedOrder = this.orders[0];
          //   }
          // });
        }
    let selectedDestinationStatesCsv = null;
    if (cityZipFetchDestination === 'false') {
          const selectedDestinationStates: [] = JSON.parse(localStorage.getItem('selectedDestinationStates'));
          if (selectedDestinationStates.length > 0) {
            selectedDestinationStatesCsv = selectedDestinationStates.join(', ');
          }
          // this.spinner.show();
          // this.apiService
          // .getOrdersByStatesIn(selectedOriginStatesCsv, '', selectedOriginStatesCsv, 0, this.config.itemsPerPage)
          // // .pipe(takeUntil(this.destroy$))
          // .subscribe((pagedOrders: PagedOrders) => {
          //   this.spinner.hide();
          //   this.orders = pagedOrders.orders;
          //   this.config.totalItems = pagedOrders.totalItems;
          //   if (pagedOrders.orders.length > 0) {
          //     this.selectedOrder = this.orders[0];
          //   }
          // });
        }
    let primarySort = localStorage.getItem('primarySort');
    let secondarySort = localStorage.getItem('secondarySort');
    let trailerCondition = localStorage.getItem('trailerCondition');
    let vehicleType = localStorage.getItem('vehicleType');
    let carrierPay = localStorage.getItem('carrierPay');
    let perMilePerCarMin = localStorage.getItem('perMilePerCarMin');
    primarySort = Constants.getSortName(primarySort);
    secondarySort = Constants.getSortName(secondarySort);
    // trailerCondition = Constants.getSortName(trailerCondition);
    // vehicleType = Constants.getSortName(vehicleType);
    // carrierPay = Constants.getSortName(carrierPay);
    // perMilePerCarMin = Constants.getSortName(perMilePerCarMin);
    if (primarySort === '') {
      primarySort = null;
    }
    if (secondarySort === '') {
      secondarySort = null;
    }
    if (trailerCondition === '') {
      trailerCondition = null;
    }
    if (vehicleType === '') {
      vehicleType = null;
    }
    if (carrierPay === '') {
      carrierPay = null;
    }
    if (perMilePerCarMin === '') {
      perMilePerCarMin = null;
    }
    const fieldEqualToMap = new Map();
    const fieldGreaterThanEqualToMap =  new Map();
    if (trailerCondition !== null && trailerCondition !== 'All') { // check
      fieldEqualToMap.set(Constants.getSortName('trailerCondition'), trailerCondition === 'Operable' ? 0 : 1);
    }
    if (vehicleType !== null) {
      fieldEqualToMap.set(Constants.getSortName('vehicleType'), vehicleType);
    }
    if (carrierPay !== null) {
      fieldGreaterThanEqualToMap.set(Constants.getSortName('carrierPay'), carrierPay);
    }
    if (perMilePerCarMin !== null) {
      fieldGreaterThanEqualToMap.set(Constants.getSortName('perMilePerCarMin'), perMilePerCarMin);
    }
    const fieldEqualToJson = {};
    fieldEqualToMap.forEach((value, key) => {
      fieldEqualToJson[key] = value;
    });
    const fieldGreaterThanEqualToJson = {};
    fieldGreaterThanEqualToMap.forEach((value, key) => {
      fieldGreaterThanEqualToJson[key] = value;
    });
    if ((latitudeLongitudeRefs.pickupLatLongs !== undefined && latitudeLongitudeRefs.pickupLatLongs.length > 0)
          || (latitudeLongitudeRefs.deliveryLatLongs !== undefined && latitudeLongitudeRefs.deliveryLatLongs.length > 0)
              || selectedOriginStatesCsv !== null || selectedDestinationStatesCsv !== null || primarySort !== null) {
        this.apiService
              .getFilteredOrders(
                latitudeLongitudeRefs, selectedOriginStatesCsv, selectedDestinationStatesCsv,
                primarySort, secondarySort, fieldEqualToJson, fieldGreaterThanEqualToJson,
                pageNumber, this.config.itemsPerPage
              )
              // .pipe(takeUntil(this.destroy$))
              .subscribe((pagedOrders: PagedOrders) => {
                this.spinner.hide();
                this.orders = pagedOrders.orders;
                this.config.totalItems = pagedOrders.totalItems;
                if (pagedOrders.orders.length > 0) {
                  this.selectedOrder = this.orders[0];
                }
                localStorage.setItem('latitudeLongitudeRefs', JSON.stringify(latitudeLongitudeRefs));
                localStorage.setItem('drawRadius', 'true');
                this.initializeMap(true);
              });
        } else {
          this.fetchOrders(0);
          this.config.currentPage = 1;
          localStorage.setItem('latitudeLongitudeRefs', null);
          localStorage.setItem('drawRadius', null);
        }
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
          localStorage.setItem('drawRadius', null);
          this.initializeMap(false);
        });
    } else if (SearchFiltersDialogComponent.hasFilter()
      // (localStorage.getItem('selectedOriginCities') !== null
      //           && JSON.parse(localStorage.getItem('selectedOriginCities')).length > 0) ||
      //      (localStorage.getItem('selectedDestinationCities') !== null
      //           && JSON.parse(localStorage.getItem('selectedDestinationCities')).length > 0) ||
      //      (localStorage.getItem('selectedOriginStates') !== null
      //           && JSON.parse(localStorage.getItem('selectedOriginStates')).length > 0) ||
      //      (localStorage.getItem('selectedDestinationStates') !== null
      //           && JSON.parse(localStorage.getItem('selectedDestinationStates')).length > 0)
                ) {
                  this.fetchFilteredOrders(pageNumber);
    } else {
      this.apiService
        .getOrdersByStatusIn(
          environment.NEW_ORDER, null, null,
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
          this.initializeMap(false);
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
    if (
      localStorage.getItem('selectedOriginStates') !== null &&
      JSON.parse(localStorage.getItem('selectedOriginStates')).length > 0
    ) {
      count += JSON.parse(localStorage.getItem('selectedOriginStates')).length;
    }
    if (
      localStorage.getItem('selectedDestinationStates') !== null &&
      JSON.parse(localStorage.getItem('selectedDestinationStates')).length > 0
    ) {
      count += JSON.parse(localStorage.getItem('selectedDestinationStates'))
        .length;
    }
    const primarySort = localStorage.getItem('primarySort');
    if (primarySort !== 'Post Date' && primarySort !== null && primarySort !== '') {
      count++;
    }
    if (localStorage.getItem('secondarySort') !== null && localStorage.getItem('secondarySort') !== '') {
      count++;
    }
    const trailerCondition = localStorage.getItem('trailerCondition');
    if (trailerCondition !== 'All' && trailerCondition !== null && trailerCondition !== '') {
      count++;
    }
    if (localStorage.getItem('vehicleType') !== null && localStorage.getItem('vehicleType') !== '') {
      count++;
    }
    if (localStorage.getItem('carrierPay') !== null && localStorage.getItem('carrierPay') !== '') {
      count++;
    }
    if (localStorage.getItem('perMilePerCarMin') !== null && localStorage.getItem('perMilePerCarMin') !== '') {
      count++;
    }

    return count;
  }

  initializeMap(drawRadius: boolean) {
    if (this.mapDisplayed) {
      this.markers = [];
      this.orders.forEach(order => {
        this.markers.push({
          latitude: order.pickupLatitude,
          longitude: order.pickupLongitude,
          title: 'Pickup location',
          icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png'
        });
        this.markers.push({
          latitude: order.deliveryLatitude,
          longitude: order.deliveryLongitude,
          title: 'Drop off location',
          icon: 'http://www.google.com/intl/en_us/mapfiles/ms/micons/green-dot.png'
        });
      });
    // if (this.mapDisplayed) {
      this.mapHelper.initializeMap(this.gmap, this.markers, drawRadius);
    }
  }

  toggleMap() {
    this.mapDisplayed = !this.mapDisplayed;
    if (this.mapDisplayed) {
      // this.gmap.nativeElement.show();
      // this.initializeMap();
      // this.gmap.nativeElement = document.getElementById('map');
      this.changeDetectorRef.detectChanges();
      this.initializeMap(localStorage.getItem('drawRadius') === 'true');
      localStorage.setItem('mapDisplayed', 'true');
    } else {
      // this.gmap.nativeElement.hide();
      localStorage.setItem('mapDisplayed', 'false');
    }
  }
}
