import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DahsboardComponent } from './dahsboard/dahsboard.component';
import { MaterialModule } from './material/material.model'
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddVendorComponent } from './add-vendor/add-vendor.component';

import { HttpClientModule } from '@angular/common/http'
import { DatePipe } from '@angular/common';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { alertService } from './services/Alert.service';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import {MatSlidePanelModule} from 'ngx-mat-slide-panel';
import { NotificationComponent } from './notification/notification.component'
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
 

@NgModule({
  declarations: [
    AppComponent,
    DahsboardComponent,
    AddVendorComponent,
    AddPaymentComponent,
    EditProfileComponent,
    NotificationComponent,
    VendorProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatSlidePanelModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    
  ],

  providers: [
    DatePipe,
    alertService
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
