import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profileService } from '../services/profile.service';
import { paymentService } from '../services/payment.service';
import { alertService } from '../services/Alert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';
import { notificationService } from '../services/notification.service';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith, withLatestFrom} from 'rxjs/operators';
import { SideProfileComponent } from '../side-profile/side-profile.component';
import { accountService } from '../services/account.service';



@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  close: any;
  opened = true
  date: Date;
  retrieveData:any = [];
  retrieveDataLength:any;
  id;
  value;
  selectField;
  info;
  lastPayment;
  new_Date:Date;
  dateField:Date;
  priceField;
  slotField;
  vendorField;
  formStatus: boolean ;
  list: any = [];
  userData: any;
  notifyNo: any;
  notifyData:any;
  searchKey:any;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[] = [];
  ifSet: Boolean;
  myList:any = [];
  username: any;
  role: any;
  profileArray: any;
  isAdmin;
  accountRole: any;
  viewOnly: any;

  constructor(
    private router: Router,
    private profile : profileService,
    private payment: paymentService,
    private alert: alertService,
    private datePipe: DatePipe,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private accountService: accountService
  ) {
    this.close = false;

    this.selectField = null;
    this.ifSet = false;
    
   }



  ngOnInit(): void {

    
    this.username = localStorage.getItem("username");
    this.role = localStorage.getItem("role")
    
    this.identifyRole();
    this.notifyNumber();
    this.profile.findAll().subscribe(array => {
      this.retrieveData = array
      
      for (let i = 0; i < this.retrieveData.length; i++){
        this.options.push(this.retrieveData[i].IC_Number)
      }
      
      console.log(array)
      
      
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value))
    );

  }

    //identify if user is admin
    identifyRole(){
      this.accountRole = localStorage.getItem("role")
  
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

  applyFilter(){

  }

  filter(value: string): string[]{
   this.ifSet = false;
   this.list = [];
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
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

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    })
  }





onChange(deviceValue) {
  this.profile.findOne(deviceValue).subscribe(array =>{
    console.log(array)
    this.list = array;
  })
}

set(){

  console.log(this.myControl.value)

  this.profile.findByIC(this.myControl.value).subscribe(array =>{
 
    this.myList = array;
    console.log(this.myList)

    if (this.myList.length == 0){
      this.ifSet = false;
      this.vendorField = "";
      this.slotField="";
      Swal.fire('No Result Found','Please Check your IC Number and Try again','error')
    } else {
      this.ifSet = true;
      this.list = this.myList[0];
    }
  })
}

addMonths(date, months) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}

compareData(dueDate){

  if(this.list.length==0){
    Swal.fire('Please Enter IC Number','No data reference available','error')
    return;
  }

  try{

    this.payment.findByRid(this.list.rid).subscribe(data=> {
      
      this.userData = data;

      console.log(this.userData)


      if (this.userData.length == 0){
        this.list.latest_Payment_Date = this.dateField;
        this.list.latest_Payment = this.priceField;
        this.list.latest_Due_Date = dueDate;
      } else {


        var paymentDate = new Date(this.dateField);
        var paymentDay = paymentDate.getDate();
        var paymentMonth = paymentDate.getMonth()+1;
        var paymentYear = paymentDate.getFullYear();
    



        var newDate;
        var newDay;
        var newMonth;
        var newDueDate;
        var newPrice;
        var newYear;
        for(let i = 0; i<this.userData.length;i++){  //loops for latest payment
        
          var date = new Date(this.userData[i].payment_Date);
          var day = date.getDate();
          var month = date.getMonth()+1;
          var year = date.getFullYear();
          console.log("compare date:"+day+"/"+month+"/"+year)
          console.log("field date:"+paymentDay+"/"+paymentMonth+"/"+paymentYear)
          
          console.log(newDate)
          if (newDate == undefined){
            newDate = this.dateField;
            newDay = paymentDay;
            newMonth = paymentMonth;
            newYear = paymentYear;
            newDueDate = dueDate;
            newPrice = this.priceField;

          }

          if (newYear == year){
            if (newMonth == month){
              if (newDay > day){
                
                newDate = newDate;
                newDay = newDay;
                newMonth = newMonth;
                newYear = newYear;
                newDueDate = newDueDate;
                newPrice = newPrice;
                console.log("set 1")
              } else {
                newDate = date;
                newDay = day;
                newMonth = month;
                newYear = year;
                newDueDate = this.userData[i].due_Date;
                newPrice = this.userData[i].price;
                console.log("set 4")
              }
            } else if (newMonth > month) {
                newDate = newDate;
                newDay = newDay;
                newMonth = newMonth;
                newYear = newYear;
                newDueDate = newDueDate;
                newPrice = newPrice;
                console.log("set 1")
            } else {
                newDate = date;
                newDay = day;
                newMonth = month;
                newYear = year;
                newDueDate = this.userData[i].due_Date;
                newPrice = this.userData[i].price;
                console.log("set 4")
            }
          } else if (newYear > year) {
            newDate = newDate;
            newDay = newDay;
            newMonth = newMonth;
            newYear = newYear;
            newDueDate = newDueDate;
            newPrice = newPrice;
            console.log("set 1")
          } else {
            newDate = date;
            newDay = day;
            newMonth = month;
            newYear = year;
            newDueDate = this.userData[i].due_Date;
            newPrice = this.userData[i].price;
            console.log("set 4")
          }

          // if (day <= newDay){ //15<14
          //   if (month <= newMonth){ //month low
          //     if (year <= newYear){

          //       newDate = newDate;
          //       newDay = newDay;
          //       newMonth = newMonth;
          //       newYear = newYear;
          //       newDueDate = newDueDate;
          //       newPrice = newPrice;
          //       console.log("set 1")
                
          //     } else {

          //       newDate = date;
          //       newDay = day;
          //       newMonth = month;
          //       newYear = year;
          //       newDueDate = this.userData[i].due_Date;
          //       newPrice = this.userData[i].price;
          //       console.log("set 4")
          //     }

          //   } else if (year <= newYear) {
                
          //     newDate = newDate;
          //     newDay = newDay;
          //     newMonth = newMonth;
          //     newYear = newYear;
          //     newDueDate = newDueDate;
          //     newPrice = newPrice;
          //     console.log("set 1")

          //   } else {

          //     newDate = date;
          //     newDay = day;
          //     newMonth = month;
          //     newYear = year;
          //     newDueDate = this.userData[i].due_Date;
          //     newPrice = this.userData[i].price;
          //     console.log("set 4")

          //   }
          // } else if (month < newMonth) { //4vs3
          //   if (year <= newYear){ //2021
          //     newDate = newDate;
          //     newDay = newDay;
          //     newMonth = newMonth;
          //     newYear = newYear;
          //     newDueDate = newDueDate;
          //     newPrice = newPrice;
          //     console.log("set 1")

          //   } else {
          //     newDate = date;
          //     newDay = day;
          //     newMonth = month;
          //     newYear = year;
          //     newDueDate = this.userData[i].due_Date;
          //     newPrice = this.userData[i].price;
          //     console.log("set 4")
          //   }
          // } else if (month == newMonth){

          //   if (year < newYear){
          //     newDate = newDate;
          //     newDay = newDay;
          //     newMonth = newMonth;
          //     newYear = newYear;
          //     newDueDate = newDueDate;
          //     newPrice = newPrice;
          //     console.log("set 1")
          //   } else {
          //     newDate = date;
          //     newDay = day;
          //     newMonth = month;
          //     newYear = year;
          //     newDueDate = this.userData[i].due_Date;
          //     newPrice = this.userData[i].price;
          //     console.log("set 4")
          //   }

          // } else if (year < newYear){ 
   
          //   newDate = newDate;
          //   newDay = newDay;
          //   newMonth = newMonth;
          //   newYear = newYear;
          //   newDueDate = newDueDate;
          //   newPrice = newPrice;
          //   console.log("set 1")

          // } else {
          //     newDate = date;
          //     newDay = day;
          //     newMonth = month;
          //     newYear = year;
          //     newDueDate = this.userData[i].due_Date;
          //     newPrice = this.userData[i].price;
          //     console.log("set 4")
          // }
        }
        this.list.latest_Payment_Date = newDate;
        this.list.latest_Due_Date = newDueDate;
        this.list.latest_Payment = newPrice;
      }

      this.info = {
        payment_Date: this.dateField, 
        due_Date: dueDate,  
        email: this.list.email,
        send_Email: false,
        rid: this.list.rid,
        price: this.priceField
      }
  
      this.lastPayment ={
        latest_Payment_Date: this.dateField
      }

      this.selectField = this.myControl.value;
  
  
      //validation
      if(this.selectField == null){
        this.formStatus = false;
        Swal.fire('Error', 'Please select an IC number!', 'error')
        return;
  
      }
      else if(this.dateField == null){
        this.formStatus = false;
        Swal.fire('Error', 'Please enter a valid date!', 'error')
        return;
  
      }
      else if(this.priceField == null){
        this.formStatus = false;
        Swal.fire('Error', 'Please enter a price!', 'error')
        return;
  
      }
      else if(this.priceField == null && this.dateField == null && this.selectField == null){
        this.formStatus = false;
        this.failed()
      }
  
      
      if(this.formStatus == true){
  
         //update latest payment
         this.profile.update(this.list.id,this.list).subscribe(array =>{
          console.log("successfully update profile");
        })
  
        this.payment.create(this.info).subscribe(array => {
          console.log("successfully create payment");
    
          this.dateField=undefined;
          this.selectField = "";
          this.slotField = "";
          this.priceField = undefined;
          this.vendorField = "";
          this.myControl.reset();
       
          this.list = [];
        
          this.alert.successNotification();

    
        },error => {
          console.log(error + "salah bui")
        });
      }
    })

  } catch (err){


    this.list.latest_Payment_Date = this.dateField;
    this.list.latest_Payment = this.priceField;
    this.list.latest_Due_Date = dueDate;

  }

}

  submit(){
    this.formStatus = true;
  
    //add one month to date
    var dueDate = this.addMonths(new Date (this.dateField),1);
    // let latest_dueDate = this.datePipe.transform(dueDate, 'dd-MM-yyyy');

    return new Promise (async (resolve)=> {

      var compare = await this.compareData(dueDate); 

    })
    
  }

  failed(){
    
    Swal.fire('Error', 'Please complete all of the fields!', 'error')

  }

    
  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
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
      })

  }


  retrieveID(username){
    this.accountService.findByUsername(username).subscribe(data=> {
      this.profileArray = data;
      console.log(this.profileArray)
      const id = this.profileArray[0].id;
      this.openSideProfile(this.profileArray[0]);
  })

}



}
