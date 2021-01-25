import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profileService } from '../services/profile.service';
import { paymentService } from '../services/payment.service';
import { alertService } from '../services/Alert.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { DatePipe } from '@angular/common';




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

  // formattedAmount;

  constructor(
    private router: Router,
    private profile : profileService,
    private payment: paymentService,
    private alert: alertService,
    private datePipe: DatePipe
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

  submit(){
    this.formStatus = true;
  
    //add one month to date
    var dueDate = this.addMonths(new Date (this.dateField),1);
    let latest_dueDate = this.datePipe.transform(dueDate, 'dd-MM-yyyy');


    // try{

    //   this.payment.findByRid(this.list.rid).subscribe(data=> {
        
    //     this.userData = data;


    //     for(let i = 0; i<this.userData.length;i++){
        
    //       const day = this.list.latest_Payment_Date
          

    //     }
    //   })

    // } catch (err){

    // }



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

    this.list.latest_Payment_Date = this.dateField;
    this.list.latest_Payment = this.priceField;

 
 

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
        console.log(array)
      })

      this.payment.create(this.info).subscribe(array => {
        console.log(array);
  
        this.dateField=undefined;
        this.selectField = "";
        this.slotField = "";
        this.priceField = undefined;
        this.vendorField = "";

        console.log(this.list.id)
     
  
      
        this.alert.successNotification();
        
  
      },error => {
        console.log(error + "salah bui")
      });
    }
    
    

    
  }

  failed(){
    
    Swal.fire('Error', 'Please complete all of the fields!', 'error')

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
