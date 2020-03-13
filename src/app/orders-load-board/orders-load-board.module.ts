import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadBoardComponent } from './load-board/load-board.component';
import { AskToBookComponent } from './ask-to-book/ask-to-book.component';
import { AskToBookDialogComponent } from './ask-to-book-dialog/ask-to-book-dialog.component';
import { SearchFiltersComponent } from './search-filters/search-filters.component';
import { SearchFiltersDialogComponent } from './search-filters-dialog/search-filters-dialog.component';
// import { FormsModule } from '@angular/forms';
// import { MaterialModule } from '../material.module';
// import { LoadBoardComponent } from './load-board/load-board.component';
// import { AskToBookComponent } from './ask-to-book/ask-to-book.component';
// import { AskToBookDialogComponent } from './ask-to-book-dialog/ask-to-book-dialog.component';
// import { SearchFiltersComponent } from './search-filters/search-filters.component';
// import { SearchFiltersDialogComponent } from './search-filters-dialog/search-filters-dialog.component';

import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
// import { MatSelectModule } from '@angular/material';
// import { MatToolbarModule } from '@angular/material';


@NgModule({
  declarations: [
    // LoadBoardComponent,
    // AskToBookComponent,
    // AskToBookDialogComponent,
    // SearchFiltersComponent,
    // SearchFiltersDialogComponent
  LoadBoardComponent,
    AskToBookComponent,
    AskToBookDialogComponent,
    SearchFiltersComponent,
    SearchFiltersDialogComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SatDatepickerModule,
    SatNativeDateModule
    // LoadBoardComponent,
    // AskToBookComponent,
    // AskToBookDialogComponent,
    // SearchFiltersComponent,
    // SearchFiltersDialogComponent
    // MatSelectModule,
    // MatToolbarModule
  ],
  exports: [
    // LoadBoardComponent,
    // AskToBookComponent,
    // AskToBookDialogComponent,
    // SearchFiltersComponent,
    // SearchFiltersDialogComponent
  ],
  entryComponents: [
    AskToBookComponent
  ],
})
export class OrdersLoadBoardModule { }
