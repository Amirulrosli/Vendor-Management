

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as Material from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatListModule } from '@angular/material/list'
import { MatGridListModule}from '@angular/material/grid-list';
import {MatFormFieldModule}from '@angular/material/form-field'
import {MatInputModule}from '@angular/material/input'
import {MatRadioModule}from '@angular/material/radio'
import {MatSelectModule}from '@angular/material/select'
import {MatDatepickerModule}from '@angular/material/datepicker'
import  {MatNativeDateModule}from '@angular/material/core'
import {MatButtonModule}from '@angular/material/button'
import {MatCheckboxModule}from '@angular/material/checkbox'
import {MatSnackBarModule}from '@angular/material/snack-bar'
import * as Material11 from '@angular/material/table'
import * as Material12 from '@angular/material/icon'
import * as Material13 from '@angular/material/sort'
import * as Material14 from '@angular/material/paginator'
import * as Material15 from '@angular/material/dialog'
import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatButtonToggleModule} from '@angular/material/button-toggle'
import {MatTabsModule} from '@angular/material/tabs';
import {MatBadgeModule} from '@angular/material/badge';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSliderModule} from '@angular/material/slider';

@NgModule({
    declarations: [],
    imports: [
    CommonModule,
    Material.MatToolbarModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatSnackBarModule,
    MatExpansionModule,
    Material11.MatTableModule,
    Material12.MatIconModule,
    Material13.MatSortModule,
    Material14.MatPaginatorModule,
    Material15.MatDialogModule,
    MatCardModule,
    MatTabsModule,
    MatBadgeModule,
    MatAutocompleteModule,MatSliderModule
    

    ],
    exports : [
    Material.MatToolbarModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatListModule,
    MatExpansionModule,
    MatButtonModule,
    MatSnackBarModule,
    Material11.MatTableModule,
    Material12.MatIconModule,
    Material13.MatSortModule, 
    Material14.MatPaginatorModule,
    Material15.MatDialogModule,
    MatCardModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatTabsModule,
    MatBadgeModule,
    MatAutocompleteModule,
    MatSliderModule
   


  
      
    ]
  })

export class MaterialModule { }