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

  

  constructor(
    private router: Router,
    private profile : profileService,
    private payment: paymentService,
    private alert: alertService,
    private datePipe: DatePipe,
    private notification: notificationService,
    private slidePanel: MatSlidePanel
  ) {
    this.close = false;

    this.selectField = null;

    
   }



  ngOnInit(): void {
    this.notifyNumber();
    this.profile.findAll().subscribe(array => {
      this.retrieveData = array
      
      
      console.log(array)
      
      
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

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
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



onChange(deviceValue) {
  this.profile.findOne(deviceValue).subscribe(array =>{
    console.log(array)
    this.list = array;
  })
}

compareData(dueDate){

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

          

          if (day <= newDay){ //15<14
            if (month <= newMonth){ //month low
              if (year <= newYear){

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

            } else if (year <= newYear) {
                
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
          } else if (month <= newMonth) { //4vs3
            if (year < newYear){ //2021
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
          } else if (year < newYear){ 
   
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
  
  
      //validation
      if(this.selectField == null){
        this.formStatus = false;
        Swal.fire('Error', 'Please select an IC number!', 'error')
  
      }
      else if(this.dateField == null){
        this.formStatus = false;
        Swal.fire('Error', 'Please enter a valid date!', 'error')
  
      }
      else if(this.priceField == null){
        this.formStatus = false;
        Swal.fire('Error', 'Please enter a price!', 'error')
  
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



}
