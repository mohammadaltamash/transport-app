import { Component, OnInit } from '@angular/core';
import { OrderComponent } from '../order/order.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-order-dialog',
  templateUrl: './order-dialog.component.html',
  styleUrls: ['./order-dialog.component.scss']
})

export class OrderDialogComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(OrderComponent, {
      // width: '50vw',
      // height: '95vh',
      data: null,
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    this.openDialog();
  }

}
