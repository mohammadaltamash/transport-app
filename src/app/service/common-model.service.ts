import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SearchFiltersDialogComponent } from '../component/module/book-loads/search-filters-dialog/search-filters-dialog.component';
import { InviteOrderDialogComponent } from '../component/module/manage-orders/invite-order-dialog/invite-order-dialog.component';
import { Order } from '../model/order';
import { DriversListDialogComponent } from '../component/drivers-list-dialog/drivers-list-dialog.component';
import { User } from '../model/user';
import { CreateDialogComponent } from '../component/create-dialog/create-dialog.component';
import { BookOrderDialogComponent } from '../component/module/manage-orders/book-order-dialog/book-order-dialog.component';
import { PreferencesDialogComponent } from '../component/preferences-dialog/preferences-dialog.component';
import { OrderCarrier } from '../model/order-carrier';

@Injectable({
  providedIn: 'root'
})
export class CommonModelService {

  constructor(public dialog: MatDialog) { }

  openFilterDialog(): Observable<any> {
    const dialogRef = this.dialog.open(SearchFiltersDialogComponent, {
      width: '70vw',
      height: '40vw',
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    return dialogRef.afterClosed();
  }

  openInviteDialog(selectedOrder: Order, ordrCarrier: OrderCarrier): Observable<any> {
    const dialogRef = this.dialog.open(InviteOrderDialogComponent, {
      data: {
        order: selectedOrder,
        orderCarrier: ordrCarrier
      },
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    return dialogRef.afterClosed();
  }

  openAssignDriverDialog(driverz: User[], orderNumber: number): Observable<any> {
    const dialogRef = this.dialog.open(DriversListDialogComponent, {
      width: '30vw',
      data: {
        drivers: driverz,
        orderId: orderNumber
      },
      disableClose: true,
      backdropClass: 'backdropBackground',
      autoFocus: false
    });

    return dialogRef.afterClosed();
  }

  openNewDriverDialog(): Observable<any> {
  // onNewDriver(): void {
    const dialogRef = this.dialog.open(CreateDialogComponent, {
      width: '30vw',
      data: 'DRIVER',
      disableClose: true,
      backdropClass: 'backdropBackgroundTransparent'
    });

    return dialogRef.afterClosed();
  }

  openBookingDialog(selectedOrder: Order, orderCarrierRecord: string): Observable<any> {
    // this.bookDialog.openDialog();
    // const result = this.bookOrderDialogComponent.openDialog(this.selectedOrder);
    // this.selectedItem = index;
    // this.appComponent.setCurrentOrderValue(order);
    const dialogRef = this.dialog.open(BookOrderDialogComponent, {
      width: '60vw',
      // height: '70vh',
      data: {
        order: selectedOrder,
        orderCarrier: JSON.parse(orderCarrierRecord)
      },
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    return dialogRef.afterClosed();
  }

  openPreferencesDialog(): Observable<any> {
    // this.bookDialog.openDialog();
    // const result = this.bookOrderDialogComponent.openDialog(this.selectedOrder);
    // this.selectedItem = index;
    // this.appComponent.setCurrentOrderValue(order);
    const dialogRef = this.dialog.open(PreferencesDialogComponent, {
      width: '60vw',
      // height: '70vh',
      data: {
        // order: selectedOrder,
        // orderCarrier: JSON.parse(orderCarrierRecord)
      },
      disableClose: true,
      backdropClass: 'backdropBackground'
    });

    return dialogRef.afterClosed();
  }
}
