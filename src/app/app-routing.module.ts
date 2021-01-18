import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { DahsboardComponent } from "./dahsboard/dahsboard.component"
const routes: Routes = [
  {
    path: 'dashboard', component: DahsboardComponent
  },
  {
    path: 'add-vendor', component: AddVendorComponent
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
  AddVendorComponent
]
