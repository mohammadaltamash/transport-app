import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  ordersPickupToday = 0;
  ordersDeliveryToday = 0;
  paymentsPendingToday = 0;

  constructor() { }

  ngOnInit() {
  }

}
