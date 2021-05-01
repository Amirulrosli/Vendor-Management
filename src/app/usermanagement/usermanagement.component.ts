import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { accountService } from '../services/account.service';
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
    private http: HttpClient,
    private account: accountService

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

    const username = "Amirulrosli";
    const password = "Amirulrosli133@";
    const email = "meerros8100@gmail.com";
    const IC_Number = "01-119328"
    const role = "Administrator"
    var newDate = new Date();
    const last_login = newDate;


    var account1 = {
      username: username,
      password: password,
      email: email,
      IC_Number: IC_Number,
      role: role,
      last_Login: last_login
    }

    this.account.createAccount(account1).subscribe(data=> {
      console.log(data)
    }, error=> {
      console.log(error)
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
