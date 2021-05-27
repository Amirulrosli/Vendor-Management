import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { notificationService } from '../services/notification.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { accountService } from '../services/account.service';


@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AllNotificationComponent implements OnInit {

  close = true
  opened: any;
  notificationList: any;
  notifyData:any;
  time: any = [];
  notifyNo: any;
  searchKey: any;
  notificationLength: any;
  dateFilter: any;
  username: any;
  displayedColumns: string[] = [
    'id',
    // 'rid',
    'title',
    // 'description',
    'category',
    // 'date',
    // 'time'

  ];

  
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  listData: MatTableDataSource<any>;

  constructor(private location: Location,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private datePipe: DatePipe,
    private Account: accountService
    ) {

    this.opened = false;

   }

  ngOnInit(): void {

    this.notifyNumber();

    this.notification.findAll().subscribe(data=> {
      this.notificationList = data;
      this.notificationLength = this.notificationList.length;

      for (let i = 0; i < this.notificationList.length; i++) {
        console.log(this.notificationList[i].rid);
        this.Account.findByRid(this.notificationList[i].rid).subscribe(account=>{
          this.username = account
          console.log(this.username)
        });

        
      }

      // this.account.findByRid(this.notificationList.rid).subscribe(username=>{

      // })

      this.loopData();

      this.listData = new MatTableDataSource(this.notificationList);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
    })

   

  }

  loopData(){

    
    for (let i = 0; i<this.notificationList.length;i++){

      const notificationDate = this.notificationList[i].date;
      let newDate = this.datePipe.transform(notificationDate,'dd-MM-yyyy')
      let time = this.datePipe.transform(notificationDate,'HH:mm:ss')
      this.notificationList[i].date = newDate;
      this.notificationList[i].time = time;
      this.time.push(time)
    }
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
    const date = data;
    const year = date.substring(0,4);
    const month = date.substring(5,7);
    const day = date.substring(8,10);
    const fullDate = day+"-"+month+"-"+year;
    console.log(fullDate) 
    this.listData.filter = fullDate.trim().toLowerCase();
  }


  clear(){
    this.dateFilter = "";
    this.listData.filter = this.dateFilter.toLowerCase();
  }



}
