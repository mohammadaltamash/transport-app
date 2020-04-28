import {
  Component,
  OnInit,
  Inject,
  Optional,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Injectable
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapHelper {
  map: google.maps.Map;
  markers = [];
  private distanceSubject: BehaviorSubject<number>;
  public distance: Observable<number>;

  constructor() {
    this.distanceSubject = new BehaviorSubject<number>(0);
    this.distance = this.distanceSubject.asObservable();
    // this.distanceSubject.next(0);
  }

  addMarker(
    latitude: number,
    longitude: number,
    titleString: string,
    iconString: string
  ) {
    this.markers.push({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      title: titleString,
      icon: iconString
    });
  }

  initializeMap(
    gmap: ElementRef,
    mapMarkers: {
      latitude: number;
      longitude: number;
      title: string;
      icon: string;
    }[]
  ): void {
    this.markers = [];
    mapMarkers.forEach(marker => {
      this.addMarker(
        marker.latitude,
        marker.longitude,
        marker.title,
        marker.icon
      );
    });
    // this.map = new google.maps.Map(this.gmap.nativeElement, this.mapOptions);

    if (this.markers.length === 1) {
      const mapOptions: google.maps.MapOptions = {
        center: new google.maps.LatLng(
          JSON.parse(JSON.stringify(this.markers[0].position)).lat,
          JSON.parse(JSON.stringify(this.markers[0].position)).lng
        ),
        zoom: 8
      };
      this.map = new google.maps.Map(gmap.nativeElement, mapOptions);
    } else {
      this.map = new google.maps.Map(gmap.nativeElement);
    }
    // this.marker.addListener('click', () => {
    //   const infoWindow = new google.maps.InfoWindow({
    //     content: this.marker.getTitle()
    //   });
    //   infoWindow.open(this.marker.getMap(), this.marker);
    // });
    // default marker
    // this.marker.setMap(this.map);
    this.loadAllMarkers();
  }

  loadAllMarkers() {
    const bounds = new google.maps.LatLngBounds();
    this.markers.forEach(markerInfo => {
      // console.log(markerInfo);
      const marker = new google.maps.Marker({
        ...markerInfo
        // position: markerInfo.position,
        // map: this.map,
        // title: markerInfo.title
      });
      const infoWindow = new google.maps.InfoWindow({
        // content: marker.getTitle()
        content: this.getMarkerInfo(marker.getTitle())
      });
      marker.addListener('click', () => {
        infoWindow.open(marker.getMap(), marker);
      });
      marker.setMap(this.map);

      // const bounds = new google.maps.LatLngBounds();
      bounds.extend(marker.getPosition());
      // this.map.setCenter(bounds.getCenter());
      // this.map.fitBounds(bounds);
    });
    this.map.setCenter(bounds.getCenter());
    this.map.fitBounds(bounds);
  }

  getMarkerInfo(title: string) {
    // this.getDistanceMatrix();
    return `<div style="font-weight: bold">${title}</div><div></div>`;
  }

  // public getDistancia(origen: string, destino: string) {
  //   return new google.maps.DistanceMatrixService().getDistanceMatrix(
  //     {
  //       origins: [origen],
  //       destinations: [destino],
  //       travelMode: google.maps.TravelMode.DRIVING
  //     },
  //     (results: any) => {
  //       console.log(
  //         'resultados distancia (mts) -- ',
  //         results.rows[0].elements[0].distance.value
  //       );
  //     }
  //   );
  // }

  getDistanceMatrix(pickupLat: number, pickupLng: number, deliveryLat: number, deliveryLng: number) {
    // origins: [{lat: 55.93, lng: -3.118}, 'Greenwich, England'],
    // destinations: ['Stockholm, Sweden', {lat: 50.087, lng: 14.421}],

    // const origin1 = new google.maps.LatLng(55.930385, -3.118425);
    // const origin2 = 'Greenwich, England';
    // const destinationA = 'Stockholm, Sweden';
    // const destinationB = new google.maps.LatLng(50.087692, 14.42115);

    const pickupAddress = new google.maps.LatLng(pickupLat, pickupLng);
    const deliveryAddress = new google.maps.LatLng(deliveryLat, deliveryLng);

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [pickupAddress],
        destinations: [deliveryAddress],
        travelMode: google.maps.TravelMode.DRIVING
        // transitOptions: TransitOptions,
        // drivingOptions: DrivingOptions,
        // google.maps.UnitSystem.METRIC (default) (km)
        // google.maps.UnitSystem.IMPERIAL
        // unitSystem: UnitSystem,
        // avoidHighways: Boolean,
        // avoidTolls: Boolean
      },
      // callback
      (results: any, status) => {
        console.log(
          'resultados distancia (mts) -- ',
          results.rows[0].elements[0].distance.value
        );
        if (status === 'OK') {
          this.distanceSubject.next(results.rows[0].elements[0].distance.value);
        }
      }
    );

    // function callback(response, status) {
    //   // See Parsing the Results for
    //   // the basics of a callback function.
    //   if (response !== null) {
    //     console.log(
    //       'Result (mts) -- ' + status,
    //       response.rows[0].elements[0].distance.value
    //     );
    //     this.distanceSubject.next(response.rows[0].elements[0].distance.value);
    //   }
    // }
  }

  public get distanceValue(): number {
    return this.distanceSubject.value;
  }
}
