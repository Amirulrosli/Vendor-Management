import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DahsboardComponent } from './dahsboard/dahsboard.component';
import { MaterialModule } from './material/material.model'
import {FormsModule } from '@angular/forms';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { HttpClientModule } from '@angular/common/http'
@NgModule({
  declarations: [
    AppComponent,
    DahsboardComponent,
    AddVendorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
    
  ],
  providers: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
