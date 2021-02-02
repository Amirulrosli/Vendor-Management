import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { slotService } from '../services/slot.service';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.scss']
})
export class VendorDetailsComponent implements OnInit {


  slotArray:any = [];
  slot:any;
  slotRetrieved: any;
  slotRetrievedLength: any;
  slotNumber = "";
  IC_No: any;
  name:any;
  IC_Number:any;
  email:any;
  phone: any;
  rent_Date:any;
  slot_Price: any;
  rid:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private formbuilder: FormBuilder,
  private Slot: slotService,
  private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    

    console.log(this.data.dataKey)
    this.rid = this.data.dataKey.rid;
    this.name = this.data.dataKey.name;
    this.IC_Number = this.data.dataKey.IC_Number;
    this.email = this.data.dataKey.email;
    this.phone = this.data.dataKey.phone;
    this.rent_Date = this.data.dataKey.rent_Date;
    this.slot_Price = this.data.dataKey.slot_Price;



    this.retrieveSlot()
  }




  retrieveSlot(){
    this.Slot.findByRid(this.data.dataKey.rid).subscribe(data=> {
      
      this.slotRetrieved = data;
      this.slotRetrievedLength = this.slotRetrieved.length;
      this.slotArray = this.slotRetrieved;
      console.log(this.slotArray)
      console.log(this.slotRetrieved)
    }, error=> {
      console.log(error)
    })
  }

  closeModal(){

    this.dialog.closeAll();

  }

}
