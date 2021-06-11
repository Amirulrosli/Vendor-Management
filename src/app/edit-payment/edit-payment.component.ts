import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { notificationService } from '../services/notification.service';
import { paymentService } from '../services/payment.service';
import { profileService } from '../services/profile.service';
import { slotService } from '../services/slot.service';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss']
})
export class EditPaymentComponent implements OnInit {

    dataList: any;
    dateField: any;
    receiptNo:any;
    priceField: any;
    monthField: any;
    rid: any;
    vendorField: any;
    locationField: any;
    paymentArray: any;
    paymentData: any = [];
    userData: any = []
    info: any;
    lastPayment: any = []
    formStatus: any = true;
    profileDataArray: any = [];
    slotField: any;
    vendorProfile: any = [];
    accountRid: any;
  


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: profileService,
    private slotService:slotService,
    private paymentService:paymentService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router,
    private notificationService: notificationService
  ) { }

  ngOnInit(): void {

    this.receiptNo = this.data.dataKey.paymentID;

    this.paymentService.findByPaymentID(this.data.dataKey.paymentID).subscribe(data=> {
      this.paymentArray = data;

      if (this.paymentArray.length !==0){
        var newDate = new Date(this.paymentArray[0].payment_Date);
        let lateDate = this.datePipe.transform(newDate, 'yyyy-MM-dd')
        this.dateField = lateDate;
      }
    })
    this.retrieveProfile();



  }

  retrieveProfile(){
    var profileArray = [];
    this.dataList = this.data.dataKey;
    this.rid = this.data.dataKey.rid;
    console.log(this.dataList)

    this.profileService.findByRid(this.rid).subscribe(data=> {
      profileArray = data;
      this.profileDataArray = data;
      console.log(data)

      if (profileArray.length !== 0){
        this.dataList.name = profileArray[0].name;

        this.dataList.slot = profileArray[0].slot;
        

        var slotArray = [];
        this.slotService.findBySlot(profileArray[0].slot).subscribe(data=> {
          slotArray = data;

          if (slotArray.length !==0){
            this.dataList.location = slotArray[0].location;
            this.dataList.slot_Price = slotArray[0].slot_Price;

            var number = parseFloat(this.dataList.slot_Price);
            var price = parseFloat(this.data.dataKey.price);

            var cal = price/number;

            this.monthField = cal;
          }
        })
      }
    },error=> {
      console.log(error)
    })

    console.log(this.dataList)
  }

  cancel(){
    this.dialog.closeAll();
  }



  submit(){

    this.formStatus = true;
    if (this.monthField < 1){           //if month is less than 1 , month jadikan 1 month
      this.monthField = 1;
    }
    this.priceField = this.dataList.slot_Price;
    var price = parseInt(this.priceField);        //calculate amount paid
    var total_Price = price * this.monthField;
    this.priceField = total_Price;

 

    if (this.receiptNo == "" || this.receiptNo == null || this.receiptNo == undefined){                                   //Chack if Receipt null or undeifned
      Swal.fire("Add Payment Failed","Please Enter your receipt number except for auto generate.",'error')
      return;
    } 


  
    //add one month to date
    var dueDate = this.addMonths(new Date (this.dateField),this.monthField);      //create due date depending on months
    // let latest_dueDate = this.datePipe.transform(dueDate, 'dd-MM-yyyy');

    return new Promise (async (resolve)=> {


      if (this.receiptNo !== this.data.dataKey.paymentID){
        this.paymentService.findByPaymentID(this.receiptNo).subscribe(async data=> {         //check if payment ID is existed or not
          this.paymentData = data;
  
          if (this.paymentData.length !== 0){
            Swal.fire("Add Payment Failed","Duplicated Payment Receipt No., Please try Again!",'error')
            return;

          } else {

            var payment = []
            this.paymentService.findByPaymentID(this.data.dataKey.paymentID).subscribe(data=> {
              payment = data;

              if (payment.length !== 0){
                payment[0].payment_Date = null;
                payment[0].due_Date = null;

                this.paymentService.update(payment[0].id,payment[0]).subscribe(data=> {
                  console.log(data);
                  console.log(dueDate);
              
                  var compare = this.compareData(dueDate);    
                },error=> {
                  console.log(error)
                })
              }
            },error=> {
              console.log(error)
            })
            

                 //start comparing and creating payments

          }

        },error=> {
          console.log(error)
        })
        
      } else {

        var payment = []
        this.paymentService.findByPaymentID(this.data.dataKey.paymentID).subscribe(data=> {
          payment = data;
          

          if (payment.length !== 0){
            payment[0].payment_Date = null;
            payment[0].due_Date = null;
            console.log(payment)

            this.paymentService.update(payment[0].id,payment[0]).subscribe(data=> {
              console.log(dueDate);
              
              var compare = this.compareData(dueDate); 

            },error=> {
              console.log(error)
            })
          }
        },error=> {
          console.log(error)
        })
    

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

    if(this.dataList.length==0){
      Swal.fire('Non exited IC Number','No data reference available','error')
      return;
    }
  
    try{
  
      this.paymentService.findByRid(this.dataList.rid).subscribe(data=> {  //check if payment field is empty
        
        this.userData = data;
  
        console.log(this.userData)
  
  
        if (this.userData.length == 0){
          this.dataList.latest_Payment_Date = this.dateField;
          this.dataList.latest_Payment = this.priceField;
          this.dataList.latest_Due_Date = dueDate;
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
          for(let i = 0; i<this.userData.length;i++){  //loops for latest payment & due Date and display it to profiles
          
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
                } else if (newDay == day) {

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
  
          }
          this.dataList.latest_Payment_Date = newDate;
          this.dataList.latest_Due_Date = newDueDate;
          this.dataList.latest_Payment = newPrice;
        }
  
        this.info = {          
          paymentID: this.receiptNo,               //create info payment 
          payment_Date: this.dateField, 
          due_Date: dueDate,  
          email: this.dataList.email,
          send_Email: false,
          rid: this.dataList.rid,
          price: this.priceField
        }


    
        this.lastPayment ={                         //update latest payment  
          latest_Payment_Date: this.dateField
        }

    
        if(this.dateField == null){
          this.formStatus = false;
          Swal.fire('Error', 'Please enter a valid date!', 'error')
          return;
    
        }
        else if(this.priceField == null){
          this.formStatus = false;
          Swal.fire('Error', 'Please enter a price!', 'error')
          return;
    
        }
        else if(this.priceField == null && this.dateField == null){
          Swal.fire('Error', 'Please enter a price!', 'error')
          return;
        }
    
        
        if(this.formStatus == true){

          this.profileDataArray[0].latest_Payment_Date = this.dataList.latest_Payment_Date;
          this.profileDataArray[0].latest_Due_Date = this.dataList.latest_Due_Date;
          this.profileDataArray[0].latest_Payment = this.dataList.latest_Payment;
    
           //update latest payment
           this.profileService.update(this.profileDataArray[0].id,this.profileDataArray[0]).subscribe(array =>{
            console.log("successfully update profile");
          })
          var payment = []
          this.paymentService.update(this.dataList.id,this.info).subscribe(array => {
            payment = array;
            console.log(payment);
  
            Swal.fire({
              title: 'Successfully created payment, Do you want payment receipt? ',
              text: 'Do you want to continue to generate the payment receipt',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, Generate Receipt',
              cancelButtonText: 'No'
        
            }).then((result) => {
              
              //notification
              this.accountRid = sessionStorage.getItem('rid');
              var date = new Date();
  
  
              this.profileService.findByRid(this.profileDataArray[0].rid).subscribe(data =>{
                this.vendorProfile = data;
  
                // console.log(this.vendorProfile);
  
                const notify = {
                  rid: this.accountRid,
                  title: 'Vendor Payment for'+' '+this.vendorProfile[0].name, 
                  description: 'Vendor Payment with \n the name: '+this.vendorProfile[0].name+'\n Account ID: '+this.vendorProfile[0].rid+'\n was updated !',
                  category: 'Vendor Payment',
                  date: date,
                  view: false
                };
  
                this.notificationService.create(notify).subscribe(data=> {                     //create notification
                  console.log("notification created")
                },error=> {
                  console.log(error)
                })
  
              })
              
  
              if (result.value){
  
                this.dateField=undefined;
             
                this.slotField = "";
                this.priceField = undefined;
                this.vendorField = "";
                this.monthField = "1";
                this.router.navigate(['/receipt/'+this.receiptNo])
                this.dataList = [];
                this.receiptNo="";
                this.dialog.closeAll();
  
  
              } else if (result.dismiss === Swal.DismissReason.cancel){
                this.dateField=undefined;
                this.slotField = "";
                this.priceField = undefined;
                this.vendorField = "";
                this.monthField = "1";
                this.dataList = [];
                this.receiptNo="";
                Swal.fire('Success', 'Successfully update payment Data','success')
                this.dialog.closeAll()
                return;
              }
  
            })
      
           
  
      
          },error => {
            Swal.fire('Error','Cannot update payment details','error')
          });
        }
      })
  
    } catch (err){
  
  
      this.dataList.latest_Payment_Date = this.dateField;
      this.dataList.latest_Payment = this.priceField;
      this.dataList.latest_Due_Date = dueDate;
  
    }
  
  }

  

}
