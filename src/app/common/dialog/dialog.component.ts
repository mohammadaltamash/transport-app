import { Component, OnInit } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog(componentType: any, dialogData: any, backdropBackground: any): void {
    const dialogRef = this.dialog.open(componentType, {
      // width: '50vw',
      // height: '95vh',
      data: dialogData,
      disableClose: true,
      backdropClass: backdropBackground
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

}
