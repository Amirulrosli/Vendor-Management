import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../services/Profile.model';
import { profileService } from '../services/profile.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { paymentService } from '../services/payment.service';
import { Payment } from '../services/Payment.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss']
})
export class VendorProfileComponent implements OnInit {

  

  id;
  username: any;
  slot:any;
  email:any;
  retrieveData:any;
  paymentHistory:any;
  paymentList: Payment[];
  paymentData: any;
  retrieveDataLength:any;
  list:any[];
  close;
  opened = false

  nextPayment: any;
  nextDate:any;
  dateToday;
  latestPaymentDate:any;
  today;
  overdueDays;
  overdue;
  finalOverdue;
  nextPay:any;
  vendorIC;
  phoneNo;
  vendorID;

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


   displayedColumns: string[] = [

    'payment_Date',
    'due_Date',
    'price',
    'send_Email',
    'email'
  
  ];


  

  constructor(
    private router: Router,
    private profiles: profileService,
    private route: ActivatedRoute,
    private payment: paymentService,
    private datePipe: DatePipe

  ) {
    const compId = this.route.snapshot.paramMap.get('rid')
    this.id = compId
    this.close = true;

   }

  ngOnInit(): void {

    this.payment.findByRid(this.id).subscribe(data => {
      this.paymentHistory = data;
     


      // function parseDate(input) {
      //   var parts = input.match(/(\d+)/g);
      //   // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
      //   return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
      // }
     



      
     
 

      this.paymentList = this.paymentHistory.map(item=> {
        return{
          id: item.id,
          ...item as Payment
        }
      });


      console.log(this.paymentList)

      for (let i = 0; i<this.paymentList.length;i++){
        const paymentOldDate = this.paymentList[i].payment_Date;
        const dueOldDate = this.paymentList[i].due_Date;

        let payment = this.datePipe.transform(paymentOldDate,'dd-MM-yyyy')
        let due = this.datePipe.transform(dueOldDate,'dd-MM-yyyy')

        this.paymentList[i].payment_Date = payment;
        this.paymentList[i].due_Date = due;
      }

   

      this.paymentData = new MatTableDataSource(this.paymentList);
      this.paymentData.sort = this.sort;
      this.paymentData.paginator = this.paginator;



    });

    
    this.profiles.findByRid(this.id).subscribe(array=> {
      this.retrieveData = array
      this.username = this.retrieveData[0].name;
      this.slot = this.retrieveData[0].slot
      this.email = this.retrieveData[0].email
      this.vendorIC = this.retrieveData[0].IC_Number
      this.phoneNo = this.retrieveData[0].phone
      this.vendorID = this.id
      this.latestPaymentDate = this.retrieveData[0].latest_Payment_Date
      console.log(this.username)
      console.log(this.retrieveData)

      //overdue days
      this.nextDate = this.retrieveData[0].latest_Due_Date
      this.nextPayment = this.datePipe.transform(this.nextDate,'MM/dd/yyyy') 
      this.nextPay = this.datePipe.transform(this.nextPayment, 'dd LLLL yyyy')

      this.dateToday = new Date()
      this.today = this.datePipe.transform(this.dateToday,'MM/dd/yyyy')

      var parsedNextDate = parseDate(this.nextPayment)
      var parsedToday = parseDate(this.today)

      console.log("today: "+ parsedToday)
      console.log("latest Payment Date: " + parsedNextDate)

      var overdueTime = parsedToday.getTime() - parsedNextDate.getTime(); 
      this.overdueDays = overdueTime / (1000 * 3600 * 24);
      this.overdue = this.overdueDays
      var noOverdue = this.overdueDays - this.overdue
      this.finalOverdue = this.overdue
      

      if(this.overdueDays < 0){
        this.finalOverdue = noOverdue;
        console.log(this.finalOverdue);
      }

      //parse to date
      function parseDate(str) {
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }

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

}
