import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { SearchFiltersDialogComponent } from '../component/module/book-loads/search-filters-dialog/search-filters-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class CommonModelService {

  constructor(public dialog: MatDialog) { }

  openFilterDialog(): Observable<any> {
    const dialogRef = this.dialog.open(SearchFiltersDialogComponent, {
        disableClose: true,
      backdropClass: 'backdropBackground'
    });

    return dialogRef.afterClosed();
  }
}
