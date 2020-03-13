import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderListComponent } from './order-list/order-list.component';
import { LoadBoardComponent } from './orders-load-board/load-board/load-board.component';
import { SearchFiltersDialogComponent } from './orders-load-board/search-filters-dialog/search-filters-dialog.component';
import { AskToBookDialogComponent } from './orders-load-board/ask-to-book-dialog/ask-to-book-dialog.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'order', component: OrderDialogComponent},
  {path: 'orders', component: OrderListComponent},
  {path: 'loadboard', component: LoadBoardComponent},
  {path: 'searchfilters', component: SearchFiltersDialogComponent},
  {path: 'asktobook', component: AskToBookDialogComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
