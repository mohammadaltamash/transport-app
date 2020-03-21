import { Component, OnInit } from '@angular/core';
import { AskToBookComponent } from '../ask-to-book/ask-to-book.component';
import {MatDialog} from '@angular/material/dialog';
import { Order } from '../../model/order';

@Component({
  selector: 'app-ask-to-book-dialog',
  templateUrl: './ask-to-book-dialog.component.html',
  styleUrls: ['./ask-to-book-dialog.component.css']
})
export class AskToBookDialogComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog(order: Order): void {
    const dialogRef = this.dialog.open(AskToBookComponent, {
      // width: '50vw',
      // height: '95vh',
      data: order,
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
    // this.openDialog();
  }

}
