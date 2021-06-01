import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { paymentService } from '../services/payment.service';
import { profileService } from '../services/profile.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {

  paymentID: any; 
  paymentArray: any = [];
  profileArray: any = [];
  createdDate: any;
  name: any;
  IC_Number: any;
  slot: any;
  slot_Price: any;
  payment_Date: any;
  due_Date: any;
  price: any;
  email:any;


  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private paymentService: paymentService,
    private profileService: profileService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {

    this.paymentID = this.route.snapshot.paramMap.get('id');
    this.retrievePayment();

    setTimeout(() =>{

      this.printPage();
    },400)

  }


  closeModal(){

    this.location.back();

  }

  printPage(){
    console.log("printing")
    window.print();
  }

  retrievePayment(){
    this.paymentService.findByPaymentID(this.paymentID).subscribe(data=> {
      this.paymentArray = data;

      if (this.paymentArray.length !== 0){
        var newDate = new Date(this.paymentArray[0].createdAt);
        let created = this.datePipe.transform(newDate,'dd/MM/YYYY HH:mm')
        this.paymentArray[0].createdAt = created;
        this.createdDate = this.paymentArray[0].createdAt;
        this.email = this.paymentArray[0].email;
        this.price = this.paymentArray[0].price;

        var newPayment = new Date (this.paymentArray[0].payment_Date);
        var newDue = new Date (this.paymentArray[0].due_Date);

        let newLatePayment = this.datePipe.transform(newPayment,'dd/MM/YYYY HH:mm')
        let newDueDate = this.datePipe.transform(newDue,'dd/MM/YYYY HH:mm')

        this.payment_Date = newLatePayment;
        this.due_Date = newDueDate;

        this.profileService.findByRid(this.paymentArray[0].rid).subscribe(data=> {
          this.profileArray = data;

          if (this.profileArray !== 0){
            this.name = this.profileArray[0].name;
            this.IC_Number = this.profileArray[0].IC_Number;
            this.slot = this.profileArray[0].slot;
            this.slot_Price = this.profileArray[0].slot_Price;
          }
        })
      }
    })
  }

}
