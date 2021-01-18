import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getMaxListeners } from 'process';
import { profileService } from '../services/profile.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {
  close: any;
  opened = true
  date: any;

  

  constructor(private router: Router,
    private profile : profileService
    ) { 


    this.close = false;
  }

  ngOnInit(): void {
    this.date = new Date();
    var human1={
      rid:"v_01_110099a",
      name:"kania",
      IC_Number:109909,
      email: "fyp1assi@gmail.com",
      latest_Payment_Date: this.date,
      latest_Payment: 24,
      overdue: false,
      slot: "b-03",
      slot_Price: 4,
      phone: 8613135,
    };
    this.profile.create(human1).subscribe(resp=> {
      console.log(resp)
    },
    error => {
      console.log(error)
    })
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
    console.log("submit")
  }

}
