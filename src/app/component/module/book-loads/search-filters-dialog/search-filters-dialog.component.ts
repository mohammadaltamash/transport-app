import { Component, OnInit } from '@angular/core';
import { SearchFiltersComponent } from '../search-filters/search-filters.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-search-filters-dialog',
  templateUrl: './search-filters-dialog.component.html',
  styleUrls: ['./search-filters-dialog.component.scss']
})
export class SearchFiltersDialogComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(SearchFiltersComponent, {
      width: '67vw',
      // height: '90vh',
      // height: 'auto',
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
