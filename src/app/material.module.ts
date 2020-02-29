// material.module.ts

import { NgModule } from '@angular/core';
import { OptionsComponent } from './options/options.component';
import { OrderComponent } from './order/order.component';
import {
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatMenuModule,
  MatIconModule,
  MatToolbarModule,
  MatCheckboxModule,
  MatSelectModule,
  MatSidenavModule,
  MatListModule,
  MatDialogModule,
  MatDialogRef,
  MatSnackBarModule
} from '@angular/material';

const material = [
  MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule
];
@NgModule({
  imports: material,
  exports: material
})

export class MaterialModule {}
