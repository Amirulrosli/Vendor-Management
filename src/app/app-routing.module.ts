import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { DahsboardComponent } from "./dahsboard/dahsboard.component"
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
  },{
    path: 'vendor-profile/:rid', component: VendorProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = 
[
  DahsboardComponent,
  AddVendorComponent,
  AddPaymentComponent,
  VendorProfileComponent
]
