import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profileService } from '../services/profile.service';

@Component({
  selector: 'app-add-payment',
  templateUrl: './add-payment.component.html',
  styleUrls: ['./add-payment.component.scss']
})
export class AddPaymentComponent implements OnInit {
  close: any;
  opened = true
  date: any;
  // formattedAmount;

  constructor(
    private router: Router,
    private profile : profileService,
    // private currencyPipe : CurrencyPipe
  ) {
    this.close = false;
   }

//    transformAmount(element){
//     this.formattedAmount = this.currencyPipe.transform(this.formattedAmount, '$');

//     element.target.value = this.formattedAmount;
// }

  ngOnInit(): void {
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
