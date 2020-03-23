import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderDialogComponent } from './component/module/manage-orders/order-dialog/order-dialog.component';
import { DashboardComponent } from './component/module/manage-orders/dashboard/dashboard.component';
import { OrderListComponent } from './component/module/manage-orders/order-list/order-list.component';
import { LoadBoardComponent } from './component/module/book-loads/load-board/load-board.component';
import { SearchFiltersDialogComponent } from './component/module/book-loads/search-filters-dialog/search-filters-dialog.component';
import { AskToBookDialogComponent } from './component/module/book-loads/ask-to-book-dialog/ask-to-book-dialog.component';
import { LoginComponent } from './component/module/auth-components/login/login.component';
import { RegisterComponent } from './component/module/auth-components/register/register.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'order', component: OrderDialogComponent},
  {path: 'orders', component: OrderListComponent},
  {path: 'loadboard', component: LoadBoardComponent},
  {path: 'searchfilters', component: SearchFiltersDialogComponent},
  {path: 'asktobook', component: AskToBookDialogComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
