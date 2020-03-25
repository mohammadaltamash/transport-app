import { Component, OnInit, Inject } from '@angular/core';
import { User } from '../../model/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-drivers-list-dialog',
  templateUrl: './drivers-list-dialog.component.html',
  styleUrls: ['./drivers-list-dialog.component.css']
})
export class DriversListDialogComponent implements OnInit {

  drivers: User[];
  constructor(
    public dialogRef: MatDialogRef<DriversListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User[],
    private userService: UserService
  ) {
    this.drivers = data;
  }

  ngOnInit() {
  }

  onCloseClick() {
    this.dialogRef.close();
  }
}
