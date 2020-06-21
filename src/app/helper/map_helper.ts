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
import { LatitudeLongitudeDistanceRefs } from '../model/latitude-longitude-distance-refs';
import { Order } from '../model/order';

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
    iconString: string,
    ordr: Order
  ) {
    this.markers.push({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      title: titleString,
      icon: iconString,
      order: ordr
    });
  }

  initializeMap(
    gmap: ElementRef,
    mapMarkers: {
      latitude: number;
      longitude: number;
      title: string;
      icon: string;
      order: Order;
    }[],
    tripCoordinates: any[],
    drawRadius: boolean
  ): void {
    this.markers = [];
    mapMarkers.forEach(marker => {
      this.addMarker(
        marker.latitude,
        marker.longitude,
        marker.title,
        marker.icon,
        marker.order
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
    this.drawLines(tripCoordinates);
    this.drawRadius(drawRadius);
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
        content: this.getMarkerInfo(markerInfo)
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

    // const map2 = new google.maps.Map(document.getElementById('mapContainer'), mapProp);

    // Add the circle for this city to the map.
    // const cityCircle = new google.maps.Circle({
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 0.8,
    //     strokeWeight: 2,
    //     fillColor: 'transparent',
    //     fillOpacity: 0.35,
    //     map: this.map,
    //     center: bounds.getCenter(),
    //     radius: 1000000   // Meters
    // });
  }

  drawLines(
    tripCoordinates: { forEach: (arg0: (coord: google.maps.LatLng[]) => void) => void; }
  ) {
    // const coords = [{lat: 37.772, lng: -122.214},
    //   {lat: 21.291, lng: -157.821}];
    if (tripCoordinates !== null) {
      tripCoordinates.forEach((coord: google.maps.LatLng[]) => {
        const line = new google.maps.Polyline({
          path: coord,
          // geodesic: true,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 1,
          map: this.map,
        });
      });
    }

    // const line = new google.maps.Polyline({
    //   path: coords,
    //   geodesic: true,
    //   strokeColor: '#FF0000',
    //   strokeOpacity: 1.0,
    //   strokeWeight: 2,
    //   map: this.map,
    // });
    // if (tripCoordinates !== null) {
    //   const line = new google.maps.Polyline({
    //     path: tripCoordinates,
    //     geodesic: true,
    //     strokeColor: '#FF0000',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2
    //   });
    // }
  }

  drawRadius(drawRadius: boolean) {
    if (drawRadius) {
      const latitudeLongitudeRefs: LatitudeLongitudeDistanceRefs = JSON.parse(
        localStorage.getItem('latitudeLongitudeRefs')
      );
      if (latitudeLongitudeRefs !== null) {
        latitudeLongitudeRefs.pickupLatLongs.forEach(element => {
          const cityCircle = new google.maps.Circle({
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: 'transparent',
            fillOpacity: 0.35,
            map: this.map,
            center: new google.maps.LatLng(element.latitude, element.longitude),
            radius: element.distance * 1.60934 * 1000 // Meters
          });
        });
        latitudeLongitudeRefs.deliveryLatLongs.forEach(element => {
          const cityCircle = new google.maps.Circle({
            strokeColor: '#00FF00',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: 'transparent',
            fillOpacity: 0.35,
            map: this.map,
            center: new google.maps.LatLng(element.latitude, element.longitude),
            radius: element.distance * 1.60934 * 1000 // Meters
          });
        });
      }
    }
  }

  getMarkerInfo(markerInfo: any) {
    // this.getDistanceMatrix();
    return `<div style="font-weight: bold">${markerInfo.title}</div><div></div>`;
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

  getDistanceMatrix(
    pickupLat: number,
    pickupLng: number,
    deliveryLat: number,
    deliveryLng: number
  ) {
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
