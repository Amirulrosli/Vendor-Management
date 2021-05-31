import { DatePipe, Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { attachmentService } from '../services/Attachment.service';
import { paymentService } from '../services/payment.service';
import { photoService } from '../services/photo.service';
import { profileService } from '../services/profile.service';
import { relativeService } from '../services/relative.service';
import { remarkService } from '../services/remark.service';
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
  slotLocation: any;
  address: any;
  contract:any;

  profilePicture: any;
  rid:any;
  profileArray: any = [];
  photoArray: any = [];
  paymentArray: any = [];
  attachmentArray: any = [];
  relativeArray: any = [];
  remarksArray: any = [];

  remarksDescription:any;

  constructor(
  private formbuilder: FormBuilder,
  private Slot: slotService,

  private profileService: profileService,
  private photoService: photoService,
  private attachmentService: attachmentService,
  private relativeService: relativeService,
  private paymentService: paymentService,
  private remarkService: remarkService,
  private datePipe: DatePipe,

  private route: ActivatedRoute,
  private dialog: MatDialog,
  private location: Location
  ) { }

  ngOnInit(): void {


    this.rid = this.route.snapshot.paramMap.get('rid');


    this.retrieveProfile();
    this.retrievePhoto();
    this.retrieveRelative();
    this.retrievePayment();
    this.retrieveRemarks();
    this.retrieveAttachment();
    this.retrieveSlot()

    setTimeout(() =>{

      this.printPage();
    },400)

  
  }

  printPage(){
    console.log("printing")
    window.print();
  }

  retrieveProfile(){
    this.profileService.findByRid(this.rid).subscribe(data=> {
      this.profileArray = data;

      if (this.profileArray.length !==0){

        this.name = this.profileArray[0].name;
        this.IC_Number = this.profileArray[0].IC_Number;
        this.email = this.profileArray[0].email;
        this.phone = this.profileArray[0].phone;
        this.rent_Date = this.profileArray[0].rent_Date;
        this.slot_Price = this.profileArray[0].slot_Price;
        this.address = this.profileArray[0].address;
        
        if (this.profileArray[0].contract == true){
          this.contract = "Contract";
        } else {
          this.contract = "Non-Contract"
        }
        
      }
    })
  }

  retrievePhoto(){

    this.photoService.findByRid(this.rid).subscribe(data=> {
      this.photoArray = data;

      if (this.photoArray.length != 0){
        var baseURL = this.photoService.baseURL();
        var link = baseURL +"/"+this.photoArray[0].link;
        this.profilePicture = link;
        
      }
    },error=> {
      console.log(error)
    })
  }

  retrievePayment(){
    this.paymentService.findByRid(this.rid).subscribe(data=> {
      this.paymentArray = data;

      if(this.paymentArray.length !== 0){

        for (let i = 0; i<this.paymentArray.length; i++){
          var newDate = new Date (this.paymentArray[i].payment_Date);
          var newDueDate = new Date (this.paymentArray[i].due_Date);

          let lateNewDate = this.datePipe.transform(newDate,'dd/MM/YY HH:mm');
          let lateDueDate = this.datePipe.transform(newDueDate,'dd/MM/YY HH:mm');

          this.paymentArray[i].payment_Date = lateNewDate;
          this.paymentArray[i].due_Date = lateDueDate;
        }
      }

    }, error=> {
      console.log(error);
    })
  }

  retrieveAttachment(){

    this.attachmentService.findByVendorid(this.rid).subscribe(data=> {
      this.attachmentArray = data;

      if (this.attachmentArray.length !== 0){

        for(let i = 0; i<this.attachmentArray.length; i++){
          // var baseURL = this.attachmentService.baseURL();
          // var link = baseURL+"/"+this.attachmentArray[i].link;
          // this.attachmentArray[i].link = link;

          var newDueDate = new Date (this.attachmentArray[i].date_Uploaded);

          let lateNewDate = this.datePipe.transform(newDueDate,'dd/MM/YY HH:mm');
          this.attachmentArray[i].date_Uploaded = lateNewDate;

          if (this.attachmentArray[i].type !== "image/png" || this.attachmentArray[i].type !== "image/jpg" || this.attachmentArray[i].type !== "image/jpeg" || this.attachmentArray[i].type !== "image/gif" ){
            
            this.attachmentArray[i].application = true;
          } else {
            this.attachmentArray[i].application = false;
          }
        }
      }
    })
  }

  retrieveRelative(){

    this.relativeService.findByrid(this.rid).subscribe(data=> {
      this.relativeArray = data;
    }, error=> {
      console.log(error)
    })
  }

  retrieveRemarks(){
    this.remarkService.findByRid(this.rid).subscribe(data=> {
      this.remarksArray = data;


      if (this.remarksArray.length !== 0){

        this.remarksDescription = this.remarksArray[0].Description;
      }
    })
  }






  retrieveSlot(){
    this.Slot.findByRid(this.rid).subscribe(data=> {
      
      this.slotRetrieved = data;
      if (this.slotRetrieved.length !== 0){
        this.slot = this.slotRetrieved[0].slot_Number;
        this.slotLocation = this.slotRetrieved[0].location;
      }
    }, error=> {
      console.log(error)
    })
  }

  closeModal(){

    this.location.back();

  }

}
