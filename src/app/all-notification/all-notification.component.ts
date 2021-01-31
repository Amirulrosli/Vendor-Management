import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
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
  notifyData:any;
  notifyNo: any;
  searchKey: any;
  notificationLength: any;

  displayedColumns: string[] = [
  
    'title',
    'description',
    'category',
    'date',

  ];

  
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  listData: MatTableDataSource<any>;

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
      this.notificationLength = this.notificationList.length;



      this.listData = new MatTableDataSource(this.notificationList);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
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

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  onChange(data){
    console.log(data)
    this.listData.filter = data.trim().toLowerCase();
  }



}
