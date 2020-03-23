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
import { AuthGuard } from './helper/auth.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderDialogComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrderListComponent, canActivate: [AuthGuard] },
  { path: 'loadboard', component: LoadBoardComponent, canActivate: [AuthGuard] },
  { path: 'searchfilters', component: SearchFiltersDialogComponent, canActivate: [AuthGuard] },
  { path: 'asktobook', component: AskToBookDialogComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
