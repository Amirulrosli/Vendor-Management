import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { profileService } from '../services/profile.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { notificationService } from '../services/notification.service';
import { Location } from '@angular/common';
import { slotService } from '../services/slot.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {


  registrationForm: FormGroup;
  value: any;
  ICData:any;
  slotArray:any = [];
  slot:any;
  slotRetrieved: any;
  slotRetrievedLength: any;
  slotNumber = "";
  date_Now: any;
  today: any;
  IC_No: any;
  slotData: any = [];
  slotDelete: any = [];
  slotNoArray: any = [];

  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],
    phone: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', message: 'Please enter a valid phone number' },
      { type: 'maxlength', message: 'Invalid Phone Number, Phone Number cannot be more than 7 number (BN)' },
      { type: 'minlength', message: 'Invalid Phone Number, Phone Number cannot be less than 7 number (BN)' }
    ],
    IC_Number: [
      { type: 'required', message: 'Identification number is required' },
      { type: 'pattern', message: 'Please enter a valid IC number' },
      { type: 'maxlength', message: 'Please enter 6 number for the Identification number' },
      { type: 'minlength', message: 'Please enter 6 number for the Identification number' }
    ],

    rent_Date: [
      { type: 'required', message: 'Date of registration is required' },
    ],

    forIC: [

      { type: 'required', message: 'First two number is required' }

    ],

    slot: [

      { type: 'required', message: 'Slot is required' }

    ],
    slotprice: [

      { type: 'required', message: 'Slot price is required' }

    ],
    
  };
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private formbuilder: FormBuilder,
  private dialog: MatDialog,
  private profile: profileService,
  private notification: notificationService,
  private location: Location,
  private Slot: slotService
  ) {

    this.value = [
      {
        id: "00"
      },
      {
        id: "01"
      },
      {
        id: "30"
      },
      {
        id: "31"
      },
      {
        id: "50"
      },
      {
        id: "50"
      },

    ]

   }

  ngOnInit(): void {

    console.log(this.data.dataKey)
    
    

    this.registrationForm = this.formbuilder.group({
      name: ['',[Validators.required,Validators.maxLength(100)]],
      forIC: ['',[Validators.required],],
      IC_Number:['',[Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
      email: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      phone:['',[Validators.required]],
      rent_Date: ['',[Validators.required]],
      slot:[''],
      slotprice:['',[Validators.required]]
    })
    const IC_No = this.data.dataKey.IC_Number;
    const forIC = IC_No.substring(0,2);
    const IC_Number = IC_No.substring(3,9);


    var editProfile= {
      name: this.data.dataKey.name,
      forIC: forIC,
      IC_Number: IC_Number,
      email: this.data.dataKey.email,
      phone: this.data.dataKey.phone,
      rent_Date: this.data.dataKey.rent_Date,
      slot: "",
      slotprice: this.data.dataKey.slot_Price
      
    }


    this.retrieveSlot();

    this.registrationForm.setValue(editProfile)
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



  async submit(){

    

    if(!this.registrationForm.valid){
      Swal.fire("Unsuccessful","Please Check and try again!",'error')
      return;
    } else {

      const name = this.registrationForm.value.name;
      const email = this.registrationForm.value.email;
      const rent_Date = this.data.dataKey.rent_Date;
      const phone = this.registrationForm.value.phone;
      const IC_Number = this.data.dataKey.IC_Number;
      this.IC_No = IC_Number
      const slot_Price = this.registrationForm.value.slotprice;
      const slot = this.registrationForm.value.slot;

      this.date_Now = new Date();
      this.today = this.date_Now.getDate()+""+(this.date_Now.getMonth()+1)+""+this.date_Now.getFullYear();
      console.log(this.slotArray)
      
      for (let i = 0; i<this.slotArray.length;i++){
        this.slotNumber += this.slotArray[i].slot_Number+",";
      }

      var profileModel = {
        id: this.data.dataKey.id,
        rid: this.data.dataKey.rid,
        name: name,
        email: email,
        rent_Date: rent_Date,
        phone: phone,
        IC_Number: IC_Number,
        slot_Price: slot_Price,
        slot: this.slotNumber,
        latest_Payment: this.data.dataKey.latest_Payment,
        latest_Payment_Date: this.data.dataKey.latest_Payment_Date,
        overdue: this.data.dataKey.overdue,
      }

      if (this.data.dataKey.IC_Number !== IC_Number){
        this.profile.findByIC(IC_Number).subscribe(data=> {
          console.log(data)
          this.ICData = data;
  
          if (this.ICData.length == 0) {
            this.saveData(profileModel)
          } else {
            Swal.fire('Please try again!','IC Number is already existed','error')
            return;
          }
        }, err=> {
          Swal.fire('Please try again!','IC Number is already existed','error')
          return;
        });
      } else{
        this.saveData(profileModel)
      }
      
    }
   
  }



  saveData(profileModel){
    var date = new Date();
    console.log(profileModel)
    this.profile.update(this.data.dataKey.id,profileModel).subscribe(data=> {

      for (let i = 0; i <this.slotArray.length; i++){
          
        var slot = {
          rid: this.data.dataKey.rid,
          slot_Number: this.slotArray[i].slot_Number
        }

        this.Slot.findBySlot(this.slotArray[i].slot_Number).subscribe(data=> {
          this.slotData = data;
          console.log(this.slotData)

          if (this.slotData.length == 0){
            this.Slot.create(slot).subscribe(resp=> {
              console.log(this.Slot)
    
              this.slotArray = [];
    
            }, error=> {
              console.log(error)
            })
          }
        }, error=> {
          console.log(error)
        }); 
      }

      for (let i = 0; i< this.slotDelete.length; i++){
        this.Slot.delete(this.slotDelete[i].id).subscribe(data=> {
          console.log("Delete"+ data)
        }, error=> {
          console.log(error)
        });
      }

      const notify = {
        rid: this.data.dataKey.rid,
        title: 'Profile Account Update for'+' '+this.data.dataKey.name, 
        description: 'Vendor profile has been updated to '+profileModel.name+'\n with Account ID: '+profileModel.rid,
        category: 'Updated vendor profile',
        date: date,
        view: false
      };

      this.notification.create(notify).subscribe(resp=> {
        console.log(resp)
      },error=> {
        console.log(error)
      })
        console.log(data)  
 
      this.registrationForm.reset();
      Swal.fire('Success','Data have been saved','success')
      this.dialog.closeAll();
      
    },
    error=> {
      console.log(error)
      Swal.fire('Please try again','Cannot Edit vendor profile, Please Try Again!','error')
    })

  }


    addSlot(){
 
        var slot = this.registrationForm.value.slot;

        console.log(slot)
    
        if (slot !==""){
    
          var slotNo = {
            slot_Number: slot
          }
    
          this.Slot.findBySlot(slot).subscribe(data=> {
            console.log (data);
            this.slotNoArray = data;
    
            if (this.slotNoArray.length == 0){
              this.slotArray.push(slotNo);
              console.log(this.slotArray)
              this.slot="";
              this.registrationForm.controls['slot'].reset();
              this.registrationForm.value.slot = "";
            } else {
              console.log("Existed Slot")
              Swal.fire('Cannot Add Slot '+slot,'Slot already taken, Please Try Again','error')
            }
          },error=> {
            console.log(error)
          })
          
        
       } else {
        console.log("Existed Slot")
        Swal.fire('Cannot Add Slot '+slot,'Slot field is Empty, Please Try Again','error')
        }
      
  }

  
  clear(i){
    this.slotDelete.push(this.slotArray[i])
    this.slotArray.splice(i,1);
  }

  deleteSlot(id){
    this.Slot.delete(id).subscribe(data=> {
      console.log(data)
      this.retrieveSlot();
    }, error=> {
      console.log(error)
    })
  }
}



