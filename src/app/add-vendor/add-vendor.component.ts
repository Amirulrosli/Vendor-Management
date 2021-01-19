import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  value: any;
  registrationForm: FormGroup

  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    phone: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', message: 'Please enter a valid phone number' },
      { type: 'maxlength', message: 'Invalid Phone Number, Phone Number cannot be more than 7 number (BN)' },
      { type: 'minlength', message: 'Invalid Phone Number, Phone Number cannot be less than 7 number (BN)' }
    ],
    IC_Number: [
      { type: 'required', message: 'Identification number is required' },
      { type: 'pattern', message: 'Please enter a valid IC number' },
      { type: 'maxlength', message: 'Please enter 6 number for the Identification number' },
      { type: 'minlength', message: 'Please enter 6 number for the Identification number' }
    ],

    rent_Date: [
      { type: 'required', message: 'Date of registration is required' },
    ],

    forIC: [

      { type: 'required', message: 'First two number is required' }

    ]
    
  };
  
  

  constructor(private router: Router,
    private profile : profileService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder
    ) { 

    this.value = [
      {
        id: "00"
      },
      {
        id: "01"
      },
      {
        id: "30"
      },
      {
        id: "31"
      },
      {
        id: "50"
      },
      {
        id: "50"
      },

    ]

    this.close = false;
  }

  ngOnInit(): void {

    this.registrationForm = this.formbuilder.group({
      name: ['',[Validators.required,Validators.maxLength(100)]],
      forIC: ['',[Validators.required]],
      IC_Number:['',[Validators.required], Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)],
      email: ['',[Validators.required]],
      phone:['',[Validators.required], Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')],
      rent_Date: ['',[Validators.required]]
    })

    this.date = new Date();
    // let newDate = this.datePipe.transform(this.date,'dd-MM-yyyy')
    // var human1={
    //   name:"kania",
    //   IC_Number:109909,
    //   email: "fyp1assi@gmail.com",
    //   latest_Payment_Date: this.date,
    //   latest_Payment: 24,
    //   overdue: false,
    //   slot: "b-03",
    //   slot_Price: 4,
    //   phone: 8613135,
    //   rent_Date: newDate
    // };
    // this.profile.create(human1).subscribe(resp=> {
    //   console.log(resp)
    // },
    // error => {
    //   console.log(error)
    // })
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
