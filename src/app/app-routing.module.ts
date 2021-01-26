import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { DahsboardComponent } from "./dahsboard/dahsboard.component"
import { NotificationComponent } from './notification/notification.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
const routes: Routes = [
  {
    path: 'dashboard', component: DahsboardComponent
  },
  {
    path: 'add-vendor', component: AddVendorComponent
  },
  {
    path: 'add-payment', component: AddPaymentComponent
  },
  {
    path: 'notification', component: NotificationComponent
  },
  {
    path: 'vendor-profile/:rid', component: VendorProfileComponent
  },
  {
    path: 'allnotification', component: AllNotificationComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = 
[
  DahsboardComponent,
  AddVendorComponent,
  AddPaymentComponent,
  NotificationComponent,
  VendorProfileComponent,
  AllNotificationComponent
]
