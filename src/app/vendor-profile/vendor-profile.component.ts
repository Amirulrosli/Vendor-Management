import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../services/Profile.model';
import { profileService } from '../services/profile.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { paymentService } from '../services/payment.service';

@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss']
})
export class VendorProfileComponent implements OnInit {

  

  id;
  retrieveData:any;
  paymentHistory:any;
  retrieveDataLength:any;
  list:any[];
  searchKey: any;
  

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dateField:Date;
  priceField;
  slotField;
  vendorField;
  close;
  opened = true
  nameField;

  paraName;

  listData: MatTableDataSource<any>;

  displayedColumns: string[] = [
  
    'payment_Date',
    'due_Date'
  
  ];


  

  constructor(
    private router: Router,
    private profiles: profileService,
    private route: ActivatedRoute,
    private payment: paymentService

  ) {
    const compId = this.route.snapshot.paramMap.get('rid')
    this.id = compId
    this.close = false;
    console.log(this.id)
   }

  ngOnInit(): void {

    this.payment.findAllbyRID(this.id).subscribe(paymentArray => {
      this.paymentHistory = paymentArray
      console.log(this.paymentHistory)
    })

    
    this.profiles.findByRid(this.id).subscribe(array=> {
      // this.retrieveData = array
      // this.retrieveDataLength = this.retrieveData.length;
      // console.log(this.retrieveDataLength)
      console.log(array)
      // console.log(this.retrieveData.name)

      // this.paraName = "fuck"

      this.list = array
    
      console.log(this.list)
      
      // this.list = array.map(item=> {
      //   console.log(item)
      //   return{
      //     rid: item.this.rid,
      //     ...item as Profile
      //   }
      // });

      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;


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
