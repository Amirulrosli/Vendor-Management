// import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profileService } from '../services/profile.service';
import { paymentService } from '../services/payment.service';
// import { Profile } from '../services/Profile.model';
// import { identifierModuleUrl } from '@angular/compiler';

import Swal from 'sweetalert2/dist/sweetalert2.js';
import {MatSnackBar} from '@angular/material/snack-bar';




@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  close: any;
  opened = true
  date: Date;
  retrieveData:any;
  retrieveDataLength:any;
  id;
  value;
  selectField;

  info;

  dateField:Date;
  priceField;
  slotField;
  vendorField;
  

  list: any = []

  // formattedAmount;

  constructor(
    private router: Router,
    private profile : profileService,
    private payment: paymentService,
    private _snackBar: MatSnackBar
    
    // private currencyPipe : CurrencyPipe
  ) {
    this.close = false;

    this.selectField = null;

    
   }

//    transformAmount(element){
//     this.formattedAmount = this.currencyPipe.transform(this.formattedAmount, '$');

//     element.target.value = this.formattedAmount;
// }

  ngOnInit(): void {
    this.profile.findAll().subscribe(array => {
      this.retrieveData = array
      
      
      console.log(array)
      // this.list = array.map(item => {
      //   console.log(item)
      // })
      
    })

    // var newDate2 = new Date();
    // console.log(newDate2)
  }

  

  goToDashboard(){
    console.log("hantu")
    this.router.navigate(["/dashboard"]);
  }

  openNav(){
    this.close = false;
  }

  closeNav(){
    this.close = true;
  }

  submit(){
    // this.date = new Date(this.dateField.setMonth(this.dateField.getMonth()+1));
    // var newDate2 = new Date();
    // console.log(newDate2)

    //need to parse date, date returns as a string.

    this.info = {
      payment_Date: this.dateField, 
      due_Date: new Date(),  //change to calculation of next 30days
      email: this.list.email,
      send_Email: false,
      rid: this.list.rid
    }

    this.payment.create(this.info).subscribe(array => {
      console.log(array);

      this.dateField=undefined;
      this.selectField = "";
      this.slotField = "";
      this.priceField = undefined;
      this.vendorField = "";

      Swal.fire('Hi', 'We have been informed!', 'success')
      // this._snackBar.open("Data updated", "OK", {
      //   duration: 10000,
      // });

    },error => {
      console.log(error + "salah bui")
    });
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

onChange(deviceValue) {
  this.profile.findOne(deviceValue).subscribe(array =>{
    console.log(array)
    this.list = array;
  })
}


}
