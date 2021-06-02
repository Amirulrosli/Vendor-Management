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
      console.log(this.accountRole)
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
    this.accountRid = sessionStorage.getItem('rid')
    this.date = new Date();
    var today = this.datePipe.transform(this.date,'dd-MM-yyyy')

    this.role = sessionStorage.getItem('role')
    this.notificationService.findByView().subscribe(data=> {
      this.viewNotification = data;
      console.log(this.viewNotification)
      if (this.viewNotification.length !== 0){

        for (let i = 0; i<this.viewNotification.length; i++){

          var newDate = this.viewNotification[i].date;
          let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');
          this.notifDate = latest_Date;

          if (latest_Date == today){
            this.listData.push(this.viewNotification[i])
          }
        }

        console.log(this.listData)

        if (this.role == "Staff" || this.role == "View-only"){

          for (let i = 0; i<this.listData.length; i++){

            if (this.listData[i].rid == this.accountRid){
              this.listDataArray.push(this.listData[i])
            }
            console.log(this.listDataArray)
          }



        } else if (this.role == "Administrator"){
          this.listDataArray = this.listData;
          console.log(this.listDataArray)
        }

      }

    },error=> {
      console.log(error)
    })


  }


  getNotify()
{
      // if (this.role == "Staff") {
      //try
      // this.accountRid = localStorage.getItem('rid');
      // console.log(this.accountRid)
      // this.notification.findByRid(this.accountRid).subscribe(data =>{
      //   this.notifRid = data[0].rid;

      //   this.account.findByRid(this.notifRid).subscribe(acc =>{
      //     this.notifRole = acc[0].role
      //     console.log(this.notifRole)
      //   })

      //   // this.account.findByRid()
      //   // console.log(this.notifRid);
      // })

      // console.log(this.role)
      // this.notification.findAll().subscribe(data=> {
      //   this.notificationData = data;
  
      //   for (let i = 0 ; i < this.notificationData.length; i++){
      //     var latest_date = this.datePipe.transform(this.notificationData[i].date,'dd-MM-yyyy')
      //     var oldDate = this.notificationData[i].date;
      //     this.notificationData[i].date = latest_date;

          //try
          // this.notificationData[i].rid = this.notifRid;
          // this.account.findByRid(this.notificationData[i].rid).subscribe(acc =>{
          //   this.accountData = acc;
          //   this.notifRole = this.accountData[0].role
          //   console.log(this.notifRole);

            // if (this.role == "Staff" && this.notifRole =="Staff") {
            //   //get staff notif
            //   // this.notificationData[i].view==false;
            //   if (today==latest_date){
            //     if(this.notificationData[i].view==false){
            //     this.listData.push(this.notificationData[i])
            //     }
            //   } else if (this.notificationData[i].view == false){
            //     this.notificationData[i].view = true;
            //     var id = this.notificationData[i].id;
            //     var data = this.notificationData[i];
      
            //     var newData = 
            //       {
            //         id: id,
            //         rid: this.notificationData[i].rid,
            //         title: this.notificationData[i].title,
            //         description: this.notificationData[i].description,
            //         view: true,
            //         category: this.notificationData[i].category,
            //         date: oldDate
            //       };
                
    //             console.log(newData)
    //             this.notification.update(this.notificationData[i].id,newData).subscribe(data=> {
    //               console.log(data)
    //               console.log("Successfully updated notification")
    //             }, error => {
    //               console.log(error)
    //             })
    //           }
    //           // console.log("ani staff notif")
    //         } else if (this.role == "Administrator") {
    //           //get all notif
    //           if (today==latest_date){
    //             if(this.notificationData[i].view==false){
    //             this.listData.push(this.notificationData[i])
    //             console.log("ani admin notif")
    //             }
    //           } else if (this.notificationData[i].view == false){
    //             this.notificationData[i].view = true;
    //             var id = this.notificationData[i].id;
    //             var data = this.notificationData[i];
      
    //             var newData = 
    //               {
    //                 id: id,
    //                 rid: this.notificationData[i].rid,
    //                 title: this.notificationData[i].title,
    //                 description: this.notificationData[i].description,
    //                 view: true,
    //                 category: this.notificationData[i].category,
    //                 date: oldDate
    //               };
                
    //             console.log(newData)
    //             this.notification.update(this.notificationData[i].id,newData).subscribe(data=> {
    //               console.log(data)
    //               console.log("Successfully updated notification")
    //             }, error => {
    //               console.log(error)
    //             })
    //           }
              
    //         }
            
    //         // else{
    //         //   console.log("ani account lain")
    //         // }


    //       })
         
    //       // if (today==latest_date){
    //       //   if(this.notificationData[i].view==false){
    //       //   this.listData.push(this.notificationData[i])
    //       //   }
    //       // } else if (this.notificationData[i].view == false){
    //       //   this.notificationData[i].view = true;
    //       //   var id = this.notificationData[i].id;
    //       //   var data = this.notificationData[i];
  
    //       //   var newData = 
    //       //     {
    //       //       id: id,
    //       //       rid: this.notificationData[i].rid,
    //       //       title: this.notificationData[i].title,
    //       //       description: this.notificationData[i].description,
    //       //       view: true,
    //       //       category: this.notificationData[i].category,
    //       //       date: oldDate
    //       //     };
            
    //       //   console.log(newData)
    //       //   this.notification.update(this.notificationData[i].id,newData).subscribe(data=> {
    //       //     console.log(data)
    //       //     console.log("Successfully updated notification")
    //       //   }, error => {
    //       //     console.log(error)
    //       //   })
    //       // }
    //     }
    //   })

    // // }
    
    // else{
    //   this.accountRid = localStorage.getItem('rid');
    //   this.notification.findByRid(this.accountRid).subscribe(data =>{
    //     this.notifRid = data;
    //     console.log(this.notifRid);
    //   })
    //   console.log("no role")
    //   // this.account.findByRid
    // }

   
}
  close(id){
    console.log(id);
    this.notificationService.findOne(id).subscribe(data=> {
      this.retrieveData = data;
      this.retrieveData.view = true;

      this.notificationService.update(id,this.retrieveData).subscribe(res=> {
        console.log(res)
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
