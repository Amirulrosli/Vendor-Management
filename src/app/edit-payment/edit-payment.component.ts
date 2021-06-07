import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private profileService: profileService,
    private slotService:slotService,
    private paymentService:paymentService,
    private datePipe: DatePipe,
    private dialog: MatDialog
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

  

}
