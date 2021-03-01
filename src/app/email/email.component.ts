import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { emailService } from '../services/email.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  username: any;
  IC_Number: any;
  title: any;
  rid: any;
  email: any;
  Date: any;
  details: any;
  
  slot_Number: any;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private emailService: emailService
  ) { }

  ngOnInit(): void {
    console.log(this.data.dataKey)

    this.retrieveData();
  }

  retrieveData(){
    this.username = this.data.dataKey.name;
    this.IC_Number = this.data.dataKey.IC_Number;
    this.email = this.data.dataKey.email;
    this.rid = this.data.dataKey.rid;
    this.Date = new Date();
    this.slot_Number = this.data.dataKey.slot;
  }

  sendEmail(){

    console.log(this.title)


    const email = this.email;
    const body = this.details;
    const IC_Number = this.IC_Number;
    const subject = this.title;
    const Date = this.Date;
    const rid = this.rid;
    const slot_Number = this.slot_Number;

    var emailData = {
      rid,
      email,
      subject,
      body,
      IC_Number,
      Date,
      slot_Number
    }

    console.log(emailData)

    this.emailService.create(emailData).subscribe(data=> {
      Swal.fire('Successful','Email Has Been Send To '+email,'success')
      this.title = "";
      this.details = "";
      this.dialog.closeAll();
    },error=> {
      Swal.fire('Unable to Send','Please check and try again','error')
    })

  }

  closeModal(){
    this.dialog.closeAll()
  }

}
