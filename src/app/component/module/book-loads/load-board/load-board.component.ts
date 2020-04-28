import { Component, OnInit, Inject, Optional, ViewChild } from '@angular/core';
import { ApiService } from '../../../../service/api.service';
import { Order } from '../../../../model/order';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { AskToBookDialogComponent } from '../ask-to-book-dialog/ask-to-book-dialog.component';
// import { AskToBookComponent } from '../ask-to-book/ask-to-book.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppComponent } from 'src/app/app.component';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-load-board',
  templateUrl: './load-board.component.html',
  styleUrls: ['./load-board.component.scss']
})
export class LoadBoardComponent implements OnInit {
  @ViewChild(AskToBookDialogComponent) askToBookDialogComponent: { openDialog: (arg0: Order) => void; };

  orders: Order[] = [];
  selectedOrder: Order; // ?
  selectedItem: number; // ?
  // bookDialog: AskToBookDialogComponent;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private apiService: ApiService,
    private appComponent: AppComponent,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public authenticationService: AuthenticationService,
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

  showDialog(order: Order, index: number) {
    // this.bookDialog.openDialog();
    const result = this.askToBookDialogComponent.openDialog(order);
    this.selectedItem = index;
    this.appComponent.setCurrentOrderValue(order);
  }

  shouldDisplayAddress(order: Order) {
    return order.createdBy !== null && order.createdBy.email === this.authenticationService.currentUserValue.email;
  }
}
