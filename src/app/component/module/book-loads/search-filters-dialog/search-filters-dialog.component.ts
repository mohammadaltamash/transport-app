import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/service/api.service';
import { CityZipLatLong } from 'src/app/model/city-zip-lat-long';

@Component({
  selector: 'app-search-filters-dialog',
  templateUrl: './search-filters-dialog.component.html',
  styleUrls: ['./search-filters-dialog.component.scss']
})
export class SearchFiltersDialogComponent implements OnInit {
  @ViewChild('autoOrigin') autoOrigin: { clear: () => void; };
  @ViewChild('autoDestination') autoDestination: { clear: () => void; };
  primarySort: string[] = [
    'First Available Date',
    'Carrier Pay',
    '$/mile',
    'Post Date'
  ];
  secondarySort: string[] = [
    'First Available Date',
    'Carrier Pay',
    '$/mile',
    'Post Date'
  ];
  hightlightByPostedWithin: string[] = [
    'None',
    '1 hr',
    '2 hrs',
    '4 hrs',
    '8 hrs',
    '16 hrs',
    '24 hrs'
  ];
  dateAndTime: string[] = [
    '',
    'Today',
    '1 day',
    '2 days',
    '3 days',
    '4 days',
    '5 days',
    '6 days',
    '7 days',
    '10 days',
    '14 days',
    '30 days',
    '60 days'
  ];
  trailerType: string[] = ['All', 'Open', 'Enclosed'];
  trailerCondition: string[] = ['All', 'Operable', 'Inoperable'];
  vehicleTypes: string[] = [
    'Sedan',
    'Mini-van',
    'Motorcycle',
    'Pickup',
    'Suv',
    'Van',
    'Other'
  ];
  minOfVehicles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  maxOfVehicles: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  paymentTerms: string[] = ['COP/COD', 'uShip Code', 'Billing'];

  // public locationArray: LatLng[] = [];
  public locationArray: CityZipLatLong[] = [];
  // public originLocations: LatLng[] = [];
  keyword = 'city';
  selectedOriginCities: CityZipLatLong[] = [];
  selectedDestinationCities: CityZipLatLong[] = [];
  // isLoading = false;

  filterForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SearchFiltersDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    // private http: HttpClient
    private apiService: ApiService
  ) {
    // this.http
    //   .get('assets/us-zip-code-latitude-and-longitude.csv', {
    //     responseType: 'text'
    //   })
    //   .subscribe(records => {
    //     const csvToRowArray = records.split('\n');
    //     for (let index = 1; index < csvToRowArray.length - 1; index++) {
    //       const row = csvToRowArray[index].split(',');
    //       // this.locationArray.push(new LatLng(row[0], row[1], row[2], parseFloat(row[3]), parseFloat(row[4])));
    //       const location = {
    //         zip: row[0],
    //         city: row[1],
    //         state: row[2],
    //         latitude: parseFloat(row[3]),
    //         longitude: parseFloat(row[4])
    //       };
    //       // output: JSON = <JSON>location;
    //       this.locationArray.push(location);
    //     }
    //   });
    if (localStorage.getItem('selectedOriginCities') !== null &&
            JSON.parse(localStorage.getItem('selectedOriginCities')).length > 0) {
      this.selectedOriginCities = JSON.parse(localStorage.getItem('selectedOriginCities'));
    }
    if (localStorage.getItem('selectedDestinationCities') !== null &&
            JSON.parse(localStorage.getItem('selectedDestinationCities')).length > 0) {
      this.selectedDestinationCities = JSON.parse(localStorage.getItem('selectedDestinationCities'));
    }
  }

  // openDialog(): void {
  //   const dialogRef = this.dialog.open(SearchFiltersComponent, {
  //     width: '67vw',
  //     // height: '90vh',
  //     // height: 'auto',
  //     data: null,
  //     disableClose: true,
  //     backdropClass: 'backdropBackground'
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      address: '',
      miles: '',
      originOptionCity: '',
      originOptionRegion: '',
      destinationOptionCity: '',
      destinationOptionRegion: '',
      primarySort: 'Post Date',
      secondarySort: '',
      hightlightByPostedWithin: 'None',
      dateAndTime: '',
      trailerType: 'All',
      trailerCondition: 'All',
      vehicleType: '',
      minOfVehicles: '',
      maxOfVehicles: '',
      paymentTerms: '',
      carrierPay: '',
      perMilePerCarMin: ''
    });
  }

  onSubmit() {
    // if (this.selectedOriginCities.length > 0) {
    localStorage.setItem('selectedOriginCities', JSON.stringify(this.selectedOriginCities));
    // }
    // if (this.selectedDestinationCities.length > 0) {
    localStorage.setItem('selectedDestinationCities', JSON.stringify(this.selectedDestinationCities));
    // }
    this.dialogRef.close({ apply: true });
  }

  onCloseClick() {
    this.dialogRef.close({ apply: false });
  }

  onResetFilterClick() {
    localStorage.removeItem('selectedOriginCities');
    localStorage.removeItem('selectedDestinationCities');
    this.selectedOriginCities = [];
    this.selectedDestinationCities = [];
  }

  showResetFilterButton() {
    return (localStorage.getItem('selectedOriginCities') !== null &&
                JSON.parse(localStorage.getItem('selectedOriginCities')).length > 0) ||
           (localStorage.getItem('selectedDestinationCities') !== null &&
                JSON.parse(localStorage.getItem('selectedDestinationCities')).length > 0);
  }

  enableApplyButton() {
    // return this.selectedOriginCities.length > 0 || this.selectedDestinationCities.length > 0;
    return true;
  }

  originCityChange(e: { target: { value: string; }; }) {
    // const locations: any[] = this.locationArray.filter(item => item.city.toLowerCase().includes(e.target.value));
    // console.log(locations);
    // alert(locations[0].city);
  }

  selectEvent(item: CityZipLatLong, cityType: string) {
    if (cityType === 'origin') {
      if (this.selectedOriginCities.length < 5 &&
            !(this.selectedOriginCities.some(e => e.city === item.city && e.zip === item.zip))) {
        this.selectedOriginCities.push(item);
      }
      this.autoOrigin.clear();
    } else if (cityType === 'destination') {
      if (this.selectedDestinationCities.length < 5 &&
            !(this.selectedDestinationCities.some(e => e.city === item.city && e.zip === item.zip))) {
        this.selectedDestinationCities.push(item);
      }
      this.autoDestination.clear();
    }
    this.locationArray = [];
  }

  onChangeSearch(val: string) {
    // this.isLoading = true;
    this.apiService.getCityZipLatLong(val).subscribe(
      (data: CityZipLatLong[]) => {
        // this.isLoading = false;
        this.locationArray = data;
      }
    );
  }

  onFocused(e) {

  }

  onRemoveLocation(index: number, cityType: string) {
    if (cityType === 'origin') {
      this.selectedOriginCities.splice(index, 1);
    } else if (cityType === 'destination') {
      this.selectedDestinationCities.splice(index, 1);
    }
  }
}

// export class LatLng {
//   zip: string;
//   city: string;
//   state: string;
//   latitude: number;
//   longitude: number;
//   timezone: number;
//   // geopoint: string;
//   constructor(
//     zip: string,
//     city: string,
//     state: string,
//     latitude: number,
//     longitude: number
//     // timezone: number,
//     // geopoint: string
//   ) {
//     this.zip = zip;
//     this.city = city;
//     this.state = state;
//     this.latitude = latitude;
//     this.longitude = longitude;
//     // this.timezone = timezone;
//     // this.geopoint = geopoint;
//   }
// }
