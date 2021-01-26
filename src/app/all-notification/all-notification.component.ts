import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { notificationService } from '../services/notification.service';

@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.scss']
})
export class AllNotificationComponent implements OnInit {

  close = true
  opened: any;
  notificationList: any;
  listData:any=[];
  notifyData:any;
  notifyNo: any;

  constructor(private location: Location,
    private notification: notificationService,
    private slidePanel: MatSlidePanel
    ) {

    this.opened = false;

   }

  ngOnInit(): void {

    this.notifyNumber();

    this.notification.findAll().subscribe(data=> {
      this.notificationList = data;
      this.listData = this.notificationList;
      console.log(this.listData)
    })

  }

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    })
  }

  closeNav(){
    this.opened = true;
  }

  openNav(){
    this.opened = false;
  }

  back(){
    this.location.back();
  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }


}
