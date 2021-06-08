import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { notificationService } from '../services/notification.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { accountService } from '../services/account.service';
import { ThrowStmt } from '@angular/compiler';
import { DelphotoService } from '../servicesDeleted/photo.service';
import { photoService } from '../services/photo.service';
import { SideProfileComponent } from '../side-profile/side-profile.component';


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
    // 'username'
    // 'date',
    // 'time'

  ];
  viewNotification: any = [];
  listNotify: any = [];
  date: Date;
  // accountRid: string;
  listNotifyArray: any = [];
  profileArray: any = [];
  photoArray: any = []

  
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  listData: MatTableDataSource<any>;
  accountRid: any;
  rid: string;
  role: string;
  staffNotif: any = [];
  accountRole: any;
  profileID: any;
  profilePhoto: any;
  accName: any;
  

  constructor(private location: Location,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private datePipe: DatePipe,
    private Account: accountService,
    private photoService: photoService
    ) {

    this.opened = false;

   }

  ngOnInit(): void {

    // this.listData.sort = this.sort;

    // const sortState: Sort = {active: 'column', direction: 'desc'};
    // this.sort.active = sortState.active;
    // this.sort.direction = sortState.direction;
    // this.sort.sortChange.emit(sortState);

    this.notifyNumber();

    this.rid = sessionStorage.getItem('rid')
    this.role = sessionStorage.getItem('role');
    this.accName = sessionStorage.getItem('username')

    // this.Account.findByRid(this.rid).subscribe(data=>{
    //   console.log(data)
    // })

    this.notification.findAll().subscribe(data=> {
      this.notificationList = data;
      this.notificationLength = this.notificationList.length;

      
      if (this.role == "Staff") {   
        for (let i = 0; i < this.notificationList.length; i++) {

          if(this.rid == this.notificationList[i].rid){
            var photoArray = []
            this.photoService.findByRid(this.notificationList[i].rid).subscribe(data=> {
              photoArray = data;

              if (photoArray.length !==0){
                var baseURL = this.photoService.baseURL();
                var link = baseURL+"/"+photoArray[0].link;
                this.notificationList[i].link = link;
              }
            })

            this.staffNotif.push(this.notificationList[i]);
          }
        }
        // console.log(this.staffNotif)
        this.listData = new MatTableDataSource(this.staffNotif);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

      }else if (this.role == "Administrator") {
        
        for (let i = 0; i < this.notificationList.length; i++) {
          var photoArray = []
          this.photoService.findByRid(this.notificationList[i].rid).subscribe(data=> {
            photoArray = data;

            if (photoArray.length !==0){
              var baseURL = this.photoService.baseURL();
              var link = baseURL+"/"+photoArray[0].link;
              this.notificationList[i].link = link;
            }
          })          
        }

        this.listData = new MatTableDataSource(this.notificationList);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      }


      //link accounts
      for (let i = 0; i < this.notificationList.length; i++) { 

        this.accountRid = data[i].rid

        var accountArray = []
        this.Account.findByRid(this.accountRid).subscribe(accounts=>{
          accountArray = accounts;


          if (accountArray.length !==0){
            this.username = accountArray[0].username 
            this.accountRole = accountArray[0].role
            this.notificationList[i].username = this.username;
            this.notificationList[i].role = this.accountRole;
          }
      

        });
        

      }
      this.loopData();
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
    this.listNotifyArray = [];

    this.date = new Date();
    var today = this.datePipe.transform(this.date,'dd-MM-yyyy'); 

    this.role = sessionStorage.getItem("role");
    this.accountRid = sessionStorage.getItem('rid')
    this.notification.findByView().subscribe(data => {
      this.viewNotification = data;

      if(this.role  == "Staff" || this.role == "View-only"){
        for (let i = 0; i < this.viewNotification.length; i++) {
          if(this.viewNotification[i].rid == this.accountRid){
            var newDate = this.viewNotification[i].date;
            let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');

              if (latest_Date == today){
                this.listNotifyArray.push(this.viewNotification[i])
              }
            this.notifyNo = this.listNotifyArray.length;
          }
        } 
        
      }else if (this.role == "Administrator"){
        for (let i = 0; i < this.viewNotification.length; i++){
          var newDate = this.viewNotification[i].date;
          let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');
          if (latest_Date == today) {
            this.listNotifyArray.push(this.viewNotification);
          }
          this.notifyNo = this.listNotifyArray.length;
        }

      }

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

 

  // select(id){
  //   this.list = this.retrieveData[id];
  //   console.log(this.list)
  // }

//   onChange(deviceValue) {
//     console.log(this.retrieveData)
//     this.list = this.retrieveData[deviceValue-1];
//     console.log(this.list)
//     console.log(deviceValue);
// }

openSideProfile(id){
    
      console.log(id)

      this.slidePanel.open(SideProfileComponent, {
        slideFrom:'right',
        panelClass: "edit-modalbox1",
        data: {
          dataKey: id,
        }
      }).afterDismissed().subscribe(data=> {
        this.accName = sessionStorage.getItem("username");
        this.role = sessionStorage.getItem("role")
      })

  }


  retrieveID(username){
    this.accName = sessionStorage.getItem("username");

    this.Account.findByUsername(this.accName).subscribe(data=> {
      this.profileArray = data;
      console.log(this.profileArray)
      const id = this.profileArray[0].id;
      this.openSideProfile(this.profileArray[0]);
  })

}

retrievePhoto(){
  var accountRID = sessionStorage.getItem('rid');
  this.photoService.findByRid(accountRID).subscribe(data=> {
    this.photoArray = data;

    if (this.photoArray.length !== 0){
      var baseURL = this.photoService.baseURL();
      this.profilePhoto = baseURL+"/"+this.photoArray[0].link;
      this.profileID = this.photoArray[0].id;
    }

  },error=> {
    console.log(error)
  })
}



}
