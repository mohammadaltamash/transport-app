import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { ApiService } from '../../api.service';
import { Order } from '../../model/order';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AskToBookDialogComponent } from '../ask-to-book-dialog/ask-to-book-dialog.component';
// import { AskToBookComponent } from '../ask-to-book/ask-to-book.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-load-board',
  templateUrl: './load-board.component.html',
  styleUrls: ['./load-board.component.css']
})
export class LoadBoardComponent implements OnInit {
  @ViewChild(AskToBookDialogComponent) askToBookDialogComponent;

  orders: Order[] = [];
  selectedOrder: Order; // ?
  // bookDialog: AskToBookDialogComponent;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private apiService: ApiService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // this.bookDialog = new AskToBookDialogComponent(null);
  }

  ngOnInit() {
    this.apiService
      .getOrdersByStatusIn(environment.NEW_ORDER)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any[]) => {
        console.log(data);
        this.orders = data;
        // this.orders.push(data[22]);
        // this.orders.push(data[23]);
        // this.orders.push(data[24]);
      });
  }

  showDialog(order: Order) {
    // this.bookDialog.openDialog();
    this.askToBookDialogComponent.openDialog(order);
  }
}
