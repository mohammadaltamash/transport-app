import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderDialogComponent } from './order-dialog/order-dialog.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderListComponent } from './order-list/order-list.component';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'order', component: OrderDialogComponent},
  {path: 'orders', component: OrderListComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
