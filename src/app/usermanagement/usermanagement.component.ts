import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { notificationService } from '../services/notification.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermanagementComponent implements OnInit {

  close: any;
  opened = true
  notifyData: any = [];
  notifyNo: any;

  constructor(
    private router: Router,
    private slidePanel: MatSlidePanel,
    private notification: notificationService
  ) {
    this.close = false;
   }

  ngOnInit(): void {
    this.notifyNumber()
  }

  openNav(){
    this.close = false;
    this.opened = true;
  }

  closeNav(){
    this.opened = false;
    this.close = true;
  }

  goToDashboard(){
    this.router.navigate(['/dashboard'])
  }

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    }).afterDismissed().subscribe(data=> {
      this.notifyNumber();
    })
  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }

}
