import { NgModule } from '@angular/core';

import { 
  MatToolbarModule,
   MatIconModule, 
   MatButtonModule, 
   MatMenuModule, 
   MatListModule,
   MatExpansionModule,
   MatCardModule,
   MatRippleModule,
   MatInputModule,
   MatTabsModule,
   MatTableModule,
   MatPaginatorModule,
   MatSidenavModule,
   MatDialogModule,
   MatDatepickerModule,
   MatNativeDateModule,
   MatBadgeModule,
   MatSelectModule,
   MatFormFieldModule,
   MatSortModule,
  } from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';

const MaterialComponents = [
  MatToolbarModule, 
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatListModule,
  MatExpansionModule,
  MatCardModule,
  MatRippleModule,
  ScrollingModule,
  MatInputModule,
  MatTabsModule,
  MatTableModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatBadgeModule,
  MatSelectModule,
  MatFormFieldModule,
  MatSortModule
];

@NgModule({
  exports: [MaterialComponents],
  imports: [MaterialComponents]
})

export class MaterialModule { }
