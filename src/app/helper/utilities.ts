import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class Utilities {
  constructor(private snackBar: MatSnackBar, private toastr: ToastrService) {}
  openSnackBar(message: string, action: string) {
    // this.snackBar.open(message, action, {
    //   duration: 2000
    // });
    this.toastr.success(message, action);
  }

  showSuccess(message: string, action: string) {
    this.toastr.success(message, action);
  }
  showInfo(message: string, action: string) {
    this.toastr.info(message, action);
  }
  showError(message: string, action: string) {
    this.toastr.error(message, action);
  }
}
