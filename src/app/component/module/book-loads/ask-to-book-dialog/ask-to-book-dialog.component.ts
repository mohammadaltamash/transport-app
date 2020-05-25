import { Component, OnInit } from '@angular/core';
import { AskToBookComponent } from '../ask-to-book/ask-to-book.component';
import {MatDialog} from '@angular/material/dialog';
import { Order } from '../../../../model/order';

@Component({
  selector: 'app-ask-to-book-dialog',
  templateUrl: './ask-to-book-dialog.component.html',
  styleUrls: ['./ask-to-book-dialog.component.scss']
})
export class AskToBookDialogComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog(ordr: Order, doBook: boolean): void {
    const dialogRef = this.dialog.open(AskToBookComponent, {
      // width: '50vw',
      // height: '70%',
      data: {
        order: ordr,
        requestBooking: doBook
      },
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
