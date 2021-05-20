import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { AuthGuard } from './auth.guard';
import { CreateSlotComponent } from './create-slot/create-slot.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DahsboardComponent } from "./dahsboard/dahsboard.component"
import { DeletedRecordsComponent } from './deleted-records/deleted-records.component';
import { EditSlotComponent } from './edit-slot/edit-slot.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EmailComponent } from './email/email.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { VendorProfileComponent } from './vendor-profile/vendor-profile.component';
const routes: Routes = [
  {
    path: 'dashboard', component: DahsboardComponent,
    canActivate: [AuthGuard]

  },
  {
    path: '', component: LoginComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'add-vendor', component: AddVendorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-payment', component: AddPaymentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notification', component: NotificationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor-profile/:rid', component: VendorProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'allnotification', component: AllNotificationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'email', component: EmailComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'usermanagement', component: UsermanagementComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-user', component: CreateUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-user', component: EditUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deleted-records', component: DeletedRecordsComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'create-slot', component: CreateSlotComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'edit-slot', component: EditSlotComponent,
    canActivate: [AuthGuard]
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
  EditSlotComponent,
  CreateSlotComponent
]
