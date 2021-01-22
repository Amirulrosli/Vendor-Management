import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { profileService } from '../services/profile.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {


  registrationForm: FormGroup;
  value: any;
  ICData:any;

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
  private profile: profileService
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
      forIC: ['',[Validators.required]],
      IC_Number:['',[Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
      email: ['',[Validators.required]],
      phone:['',[Validators.required]],
      rent_Date: ['',[Validators.required]],
      slot:['',[Validators.required]],
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
      slot: this.data.dataKey.slot,
      slotprice: this.data.dataKey.slot_Price
      
    }

    this.registrationForm.setValue(editProfile)
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
      const rent_Date = this.registrationForm.value.rent_Date;
      const phone = this.registrationForm.value.phone;
      const next_IC = this.registrationForm.value.IC_Number;
      const forIC = this.registrationForm.value.forIC;
      const IC_Number = forIC+"-"+next_IC;
      const slot_Price = this.registrationForm.value.slotprice;
      const slot = this.registrationForm.value.slot;

        
      var profileModel = {
        id: this.data.dataKey.id,
        rid: this.data.dataKey.rid,
        name: name,
        email: email,
        rent_Date: rent_Date,
        phone: phone,
        IC_Number: IC_Number,
        slot_Price: slot_Price,
        slot: slot,
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



  async saveData(profileModel){
    await this.profile.update(this.data.dataKey.id,profileModel).subscribe(data=> {
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


}



