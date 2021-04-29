import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { attachmentService } from '../services/Attachment.service';
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
  link: any;
  action = "http://localhost:3000/upload-Profile"

  constructor(
    private router: Router,
    private slidePanel: MatSlidePanel,
    private notification: notificationService,
    private attachment: attachmentService,
    private http: HttpClient

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

  change(file){

    this.link = file.target.files[0];

  }

  submit(){

    const vendor_rid = "13y14hbfhgjaf"
    const account_rid = "121212121"
    const link = this.link;

    var attachment = {
      vendor_rid: vendor_rid,
      account_rid: account_rid,
      link: link
    }

    this.http.post(this.action,attachment).subscribe(data=> {
      console.log(data)
    })




  //   try{

  //     this.attachment.create(attachment).subscribe(data=> {
  //       console.log(data)
  //     },error=> {
  //       console.log( error)
  //     })

  //   } catch (error){
  //     console.log(error)
  //   }



  }

}
