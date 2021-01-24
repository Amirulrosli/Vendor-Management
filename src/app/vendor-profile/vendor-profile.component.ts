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
  opened = true
  
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
    this.close = false;

   }

  ngOnInit(): void {

    this.payment.findByRid(this.id).subscribe(data => {
      this.paymentHistory = data;
 

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
      console.log(this.username)
      console.log(this.retrieveData)
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
