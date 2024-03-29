import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { accountService } from '../services/account.service';
import { notificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationData:any = [];
  panelOpenState = false
  listData:any = [];
  listDataArray: any=[]
  date: Date
  retrieveData: any;
  role: any;
  accountRid: string;
  notifRid: any;
  notifRole: any;
  accountData: any = [];
  viewNotification: any = [];
  notifDate: any;
  accountRole: any;
  isAdmin: any;
  viewOnly: any;
  

  constructor(
    private notificationService: notificationService,
    private datePipe: DatePipe,
    private router: Router,
    private slidePanel: MatSlidePanel,
    private accountService: accountService
    ) { }

  ngOnInit(): void {

    this.getNotification();
    this.identifyRole();
 
  }

   //identify if user is admin
   identifyRole(){
    this.accountRole = sessionStorage.getItem("role")

    if (this.accountRole == "Administrator") {
      //.log(this.accountRole)
      this.isAdmin = true;
    } else{
      this.isAdmin = false;
    }

    if (this.accountRole == "View-only") {
      this.isAdmin = false;
      this.viewOnly = true;
    }


  }

  getNotification(){
    this.listData = [];
    this.accountRid = sessionStorage.getItem('rid')
    this.date = new Date();
    var today = this.datePipe.transform(this.date,'dd-MM-yyyy')

    this.role = sessionStorage.getItem('role')
    this.notificationService.findByView().subscribe(data=> {
      this.viewNotification = data;
      //.log(this.viewNotification)
      if (this.viewNotification.length !== 0){

        for (let i = 0; i<this.viewNotification.length; i++){

          var newDate = this.viewNotification[i].date;
          let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');
          this.notifDate = latest_Date;

          if (latest_Date == today){
            this.listData.push(this.viewNotification[i])
          }
        }

        //.log(this.listData)

        if (this.role == "Staff" || this.role == "View-only"){

          for (let i = 0; i<this.listData.length; i++){

            if (this.listData[i].rid == this.accountRid){
              this.listDataArray.push(this.listData[i])
            }
            //.log(this.listDataArray)
          }



        } else if (this.role == "Administrator"){
          this.listDataArray = this.listData;
          //.log(this.listDataArray)
        }

      }

    },error=> {
      console.log(error)
    })


  }

  close(id){
    //.log(id);
    this.notificationService.findOne(id).subscribe(data=> {
      this.retrieveData = data;
      this.retrieveData.view = true;

      this.notificationService.update(id,this.retrieveData).subscribe(res=> {
        //.log(res)
        this.getNotification();
      }, error=> {
        console.log(error)
      })
    }, error=> {
      console.log(error)
    })
  }

  showNotification(){
    this.slidePanel.dismiss();
    this.router.navigate(['/allnotification'])
  }

}
