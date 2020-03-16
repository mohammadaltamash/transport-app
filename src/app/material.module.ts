// material.module.ts

import { NgModule } from '@angular/core';

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
  MatSnackBarModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule
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
    MatSnackBarModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule
];
@NgModule({
  imports: material,
  exports: material
})

export class MaterialModule {}
