import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DahsboardComponent } from './dahsboard/dahsboard.component';
import { MaterialModule } from './material/material.model'
import {FormsModule } from '@angular/forms';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
<<<<<<< HEAD
import { HttpClientModule } from '@angular/common/http'
import { DatePipe } from '@angular/common';
=======
import { HttpClientModule } from '@angular/common/http';
import { AddPaymentComponent } from './add-payment/add-payment.component'

import { CommonModule, CurrencyPipe} from '@angular/common';

>>>>>>> b7cb65ddf23c3b8234752b678aa3110b96da0447
@NgModule({
  declarations: [
    AppComponent,
    DahsboardComponent,
    AddVendorComponent,
    AddPaymentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule
    
  ],
<<<<<<< HEAD
  providers: [
    DatePipe
  ],
=======
  providers: [CurrencyPipe],
>>>>>>> b7cb65ddf23c3b8234752b678aa3110b96da0447
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
