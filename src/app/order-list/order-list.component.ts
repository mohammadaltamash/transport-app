import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Order } from '../order';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  all = 0;
  new = 0;
  accepted = 0;
  assigned = 0;
  pickedup = 0;
  delivered = 0;

  step = false;

  orders: Order[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getOrders().pipe(takeUntil(this.destroy$)).subscribe((data: any[]) => {
      this.all = data.length;
      console.log(data);
      this.orders = data;
    });
  }


}
