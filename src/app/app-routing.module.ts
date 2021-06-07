import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPaymentComponent } from './add-payment/add-payment.component';
import { AddVendorComponent } from './add-vendor/add-vendor.component';
import { AdminGuard } from './admin.guard';
import { AllNotificationComponent } from './all-notification/all-notification.component';
import { AuthGuard } from './auth.guard';
import { CreateSlotComponent } from './create-slot/create-slot.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { DahsboardComponent } from "./dahsboard/dahsboard.component"
import { DeletedProfileComponent } from './deleted-profile/deleted-profile.component';
import { DeletedRecordsComponent } from './deleted-records/deleted-records.component';
import { EditPaymentComponent } from './edit-payment/edit-payment.component';
import { EditSlotComponent } from './edit-slot/edit-slot.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EmailComponent } from './email/email.component';
import { LoginComponent } from './login/login.component';
import { NotificationComponent } from './notification/notification.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { ReportComponent } from './report/report.component';
import { RoleGuard } from './role.guard';
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
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
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'add-payment', component: AddPaymentComponent,
    canActivate: [AuthGuard, RoleGuard]
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
    canActivate: [AuthGuard, RoleGuard]
  },
  {
    path: 'email', component: EmailComponent,
    canActivate: [AuthGuard]
  }, 
  {
    path: 'usermanagement', component: UsermanagementComponent,
    canActivate: [AuthGuard, AdminGuard], 
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
    canActivate: [AuthGuard, RoleGuard]
  },

  {
    path: 'create-slot', component: CreateSlotComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'edit-slot', component: EditSlotComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'deleted-profile/:rid', component: DeletedProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vendor-details/:rid', component: VendorDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'receipt/:id', component: ReceiptComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'report', component: ReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-payment', component: EditPaymentComponent,
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
  CreateSlotComponent,
  VendorDetailsComponent,
  ReceiptComponent,
  ReportComponent,
  EditPaymentComponent
]
