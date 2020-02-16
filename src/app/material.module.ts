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
  MatListModule
  // MatDialogModule,
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
    // MatDialogModule,
    MatSidenavModule,
    MatListModule
]
@NgModule({
  imports: material,
  exports: material
})

export class MaterialModule {}