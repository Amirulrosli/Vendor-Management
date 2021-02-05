import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { notificationService } from '../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  notificationData:any;
  panelOpenState = false
  listData=[];
  date: Date
  retrieveData: any;

  constructor(private notification: notificationService,
    private datePipe: DatePipe,
    private router: Router,
    private slidePanel: MatSlidePanel
    ) { }

  ngOnInit(): void {

    this.getNotification();
 
  }

  getNotification(){
    this.listData = [];
    this.date = new Date();
    var today = this.datePipe.transform(this.date,'dd-MM-yyyy')

    this.notification.findAll().subscribe(data=> {
      this.notificationData = data;

      for (let i = 0 ; i < this.notificationData.length; i++){
        var latest_date = this.datePipe.transform(this.notificationData[i].date,'dd-MM-yyyy')
        var oldDate = this.notificationData[i].date;
        this.notificationData[i].date = latest_date;
       
        if (today==latest_date){
          if(this.notificationData[i].view==false){
          this.listData.push(this.notificationData[i])
          }
        } else if (this.notificationData[i].view == false){
          this.notificationData[i].view = true;
          var id = this.notificationData[i].id;
          var data = this.notificationData[i];

          var newData = 
            {
              id: id,
              rid: this.notificationData[i].rid,
              title: this.notificationData[i].title,
              description: this.notificationData[i].description,
              view: true,
              category: this.notificationData[i].category,
              date: oldDate
            };
          
          console.log(newData)
          this.notification.update(this.notificationData[i].id,newData).subscribe(data=> {
            console.log(data)
            console.log("Successfully updated notification")
          }, error => {
            console.log(error)
          })
        }
      }
    })

  }

  close(id){
    console.log(id);
    this.notification.findOne(id).subscribe(data=> {
      this.retrieveData = data;
      this.retrieveData.view = true;

      this.notification.update(id,this.retrieveData).subscribe(res=> {
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
