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
import { photoService } from '../services/photo.service';
import { slotService } from '../services/slot.service';



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
  photoArray: any = [];
  profilePhoto:any;
  profileID: any;
  viewNotification: any = [];
  listNotify: any = [];
  // date: Date;
  accountRid: string;
  listNotifyArray: any = [];
  typeReceipt: any = "Auto";
  showReceiptField = false;
  receiptNo: any;
  monthField: any = 1;
  dataList: any = []
  paymentArray: any = []

  constructor(
    private router: Router,
    private profile : profileService,
    private payment: paymentService,
    private alert: alertService,
    private datePipe: DatePipe,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private accountService: accountService,
    private photoService: photoService,
    private slotService: slotService
  ) {
    this.close = false;

    this.selectField = null;
    this.ifSet = false;
    
   }



  ngOnInit(): void {

    this.showReceiptField = false;

    this.retrievePhoto()

    
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
   this.dataList = [];
   if (value == null){
     return;
   }
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  showReceipt(){
    if (this.typeReceipt == "Auto"){
      this.showReceiptField = false;
    } else if (this.typeReceipt == "Enter") {
      this.showReceiptField = true;
    }






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
      this.list = [];
      this.myList = [];
      Swal.fire('No Result Found','Please Check your IC Number and Try again','error')
    } else {

      this.dataList = this.myList[0];

      if (this.dataList.slot == null || this.dataList.slot == ""){
        this.ifSet = false;
        this.vendorField = "";
        this.slotField="";
        this.dataList = [];
        this.list = [];
        Swal.fire('No Result Found','Slot taken by profile is not found, please register vendor slot number to proceed','error')
        return;
      }

      this.ifSet = true;
      this.list = this.myList[0];
    
      var slotArray = []
      this.slotService.findBySlot(this.dataList.slot).subscribe(data=> {
        slotArray = data;

        if (slotArray.length !==0){
          this.dataList.location = slotArray[0].location;
        }
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

  if(this.list.length==0){
    Swal.fire('Please Enter IC Number','No data reference available','error')
    return;
  }

  try{

    this.payment.findByRid(this.list.rid).subscribe(data=> {  //check if payment field is empty
      
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
        this.list.latest_Payment_Date = newDate;
        this.list.latest_Due_Date = newDueDate;
        this.list.latest_Payment = newPrice;
      }

      this.info = {          
        paymentID: this.receiptNo,               //create info payment 
        payment_Date: this.dateField, 
        due_Date: dueDate,  
        email: this.list.email,
        send_Email: false,
        rid: this.list.rid,
        price: this.priceField
      }
  
      this.lastPayment ={                         //update latest payment  
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
        var payment = []
        this.payment.create(this.info).subscribe(array => {
          payment = array;
          console.log(payment);

          Swal.fire({
            title: 'Do you want payment receipt? ',
            text: 'Do you want to continue to generate the payment receipt',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Generate Receipt',
            cancelButtonText: 'No'
      
          }).then((result) => {

            if (result.value){

              this.dateField=undefined;
              this.selectField = "";
              this.slotField = "";
              this.priceField = undefined;
              this.vendorField = "";
              this.monthField = "1";
              this.typeReceipt = "Auto";
              this.list = [];
              this.dataList = [];
              this.myControl.reset();
              this.showReceiptField = false;
              this.receiptNo="";

              this.router.navigate(['/receipt/'+array.paymentID])


            } else if (result.dismiss === Swal.DismissReason.cancel){
              this.dateField=undefined;
              this.selectField = "";
              this.slotField = "";
              this.priceField = undefined;
              this.vendorField = "";
              this.monthField = "1";
              this.typeReceipt = "Auto";
              this.list = [];
              this.dataList = [];
              this.myControl.reset();
              this.showReceiptField = false;
              this.receiptNo="";
    
            
              this.alert.successNotification();
              return;
            }

          })
    
         

    
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
    this.priceField = this.dataList.slot_Price;

    var price = parseInt(this.priceField);        //calculate amount paid
    var total_Price = price * this.monthField;
    this.priceField = total_Price;




    if (this.typeReceipt == "Enter"){            //Chack if Receipt no is auto or manual

      if (this.receiptNo == "" || this.receiptNo == null || this.receiptNo == undefined){
        Swal.fire("Add Payment Failed","Please Enter your receipt number except for auto generate.",'error')
        return;
      } 

    } else {
      if (this.typeReceipt == "Auto"){
        this.receiptNo = null;
      }
    }





    if (this.monthField < 1){           //if month is less than 1 , month jadikan 1 month
      this.monthField = 1;
    }
  
    //add one month to date
    var dueDate = this.addMonths(new Date (this.dateField),this.monthField);      //create due date depending on months
    // let latest_dueDate = this.datePipe.transform(dueDate, 'dd-MM-yyyy');

    return new Promise (async (resolve)=> {


      if (this.typeReceipt == "Enter"){
        this.payment.findByPaymentID(this.receiptNo).subscribe(async data=> {         //check if payment ID is existed or not
          this.paymentArray = data;
  
          if (this.paymentArray.length !== 0){
            Swal.fire("Add Payment Failed","Duplicated Payment Receipt No., Please try Again!",'error')
            return;
          } else {

            var compare = await this.compareData(dueDate);            //start comparing and creating payments

          }

        },error=> {
          console.log(error)
        })
        
      } else {

        var compare = await this.compareData(dueDate);      

      }
  



    })
    
  }



  cancel(){
    this.dateField=undefined;
    this.selectField = "";
    this.slotField = "";
    this.priceField = undefined;
    this.vendorField = "";
    this.monthField = "1";
    this.typeReceipt = "Auto";
    this.list = [];
    this.dataList = [];
    this.myControl.reset();
    this.showReceiptField = false;
    this.receiptNo="";

  }

  failed(){
    
    Swal.fire('Error', 'Please complete all of the fields!', 'error')

  }

    
  public notifyNumber(){
    this.listNotifyArray = [];

    this.date = new Date();
    var today = this.datePipe.transform(this.date,'dd-MM-yyyy'); 

    this.role = localStorage.getItem("role");
    this.accountRid = localStorage.getItem('rid')
    this.notification.findByView().subscribe(data => {
      this.viewNotification = data;

      if(this.role  == "Staff" || this.role == "View-only"){
        for (let i = 0; i < this.viewNotification.length; i++) {
          if(this.viewNotification[i].rid == this.accountRid){
            var newDate = this.viewNotification[i].date;
            let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');

              if (latest_Date == today){
                this.listNotifyArray.push(this.viewNotification[i])
              }
            this.notifyNo = this.listNotifyArray.length;
          }
        } 
        
      }else if (this.role == "Administrator"){
        for (let i = 0; i < this.viewNotification.length; i++){
          var newDate = this.viewNotification[i].date;
          let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');
          if (latest_Date == today) {
            this.listNotifyArray.push(this.viewNotification);
          }
          this.notifyNo = this.listNotifyArray.length;
        }

      }

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

retrievePhoto(){
  var accountRID = localStorage.getItem('rid');
  this.photoService.findByRid(accountRID).subscribe(data=> {
    this.photoArray = data;

    if (this.photoArray.length !== 0){
      var baseURL = this.photoService.baseURL();
      this.profilePhoto = baseURL+"/"+this.photoArray[0].link;
      this.profileID = this.photoArray[0].id;
    }

  },error=> {
    console.log(error)
  })
}



}
