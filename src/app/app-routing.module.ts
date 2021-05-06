import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DahsboardComponent } from "./dahsboard/dahsboard.component"
import { DeletedRecordsComponent } from './deleted-records/deleted-records.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EmailComponent } from './email/email.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
const routes: Routes = [
  {
    path: 'dashboard', component: DahsboardComponent
  },
  {
    path: '', component: LoginComponent
  },
  {
    path: 'login', component: LoginComponent
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
  {
    path: 'email', component: EmailComponent
  }, 
  {
    path: 'usermanagement', component: UsermanagementComponent
  },
  {
    path: 'create-user', component: CreateUserComponent
  },
  {
    path: 'edit-user', component: EditUserComponent
  },
  {
    path: 'deleted-records', component: DeletedRecordsComponent
  },
  {
    path: 'user-profile', component: UserProfileComponent
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
  AllNotificationComponent,
  LoginComponent,
  UsermanagementComponent,
  CreateUserComponent,
  EditUserComponent,
  DeletedRecordsComponent,
  UserProfileComponent
]
