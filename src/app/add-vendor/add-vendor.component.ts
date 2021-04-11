import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { alertService } from '../services/Alert.service';
import { Profile } from '../services/Profile.model';
import { profileService } from '../services/profile.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { notificationService } from '../services/notification.service';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { slotService } from '../services/slot.service';


@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss']
})
export class AddVendorComponent implements OnInit {
  close: any;
  opened = true
  date: any;
  value: any;
  registrationForm: FormGroup;
  name:any;
  email:any;
  phone:any;
  IC_Number: any;
  rent_Date: any;
  forIC: any;
  slot: any;
  slotprice: any;
  ICData: any;
  notifyNo: any;
  notifyData:any;
  slotArray:any =[];
  slotNumber: any = [];

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
  
  

  constructor(private router: Router,
    private profile : profileService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder,
    private alert: alertService,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
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
        id: "51"
      },

    ]

    this.close = false;
  }

  ngOnInit(): void {

    this.notifyNumber();
    
    this.registrationForm = this.formbuilder.group({
      name: ['',[Validators.required,Validators.maxLength(100)]],
      forIC: ['',[Validators.required]],
      IC_Number:['',[Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
      email: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      phone:['',[Validators.required]],
      rent_Date: ['',[Validators.required]],
      slot:[''],
      slotprice:['',[Validators.required]]
    })

    //, Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$'

    this.date = new Date();
    // let newDate = this.datePipe.transform(this.date,'dd-MM-yyyy')
    // var human1={
    //   name:"kania",
    //   IC_Number:109909,
    //   email: "fyp1assi@gmail.com",
    //   latest_Payment_Date: this.date,
    //   latest_Payment: 24,
    //   overdue: false,
    //   slot: "b-03",
    //   slot_Price: 4,
    //   phone: 8613135,
    //   rent_Date: newDate
    // };
    // this.profile.create(human1).subscribe(resp=> {
    //   console.log(resp)
    // },
    // error => {
    //   console.log(error)
    // })
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

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    })
  }

  async submit(){

    if (this.slotArray.length == 0){
      Swal.fire("Unsuccessful","Please Enter slot number!",'error')
      return;
    }

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

      this.profile.findByIC(IC_Number).subscribe(async data=> {
        console.log(data)
        this.ICData = data;

        if (this.ICData.length == 0) {

        var slotNumber = "";
        const date_Now = new Date();
        let today = date_Now.getDate()+""+(date_Now.getMonth()+1)+""+date_Now.getFullYear();
        console.log(this.slotArray)
        
        for (let i = 0; i<this.slotArray.length;i++){
          slotNumber += this.slotArray[i].slot+",";
        }
      
          console.log(slotNumber)

          var profileModel = {
            name: name,
            email: email,
            rent_Date: rent_Date,
            phone: phone,
            IC_Number: IC_Number,
            slot_Price: slot_Price,
            slot: slotNumber
          }
        
        
    
        await this.profile.create(profileModel).subscribe(data=> {

          for (let i = 0; i <this.slotArray.length; i++){
            
            var slot = {
              rid: "V_01"+today+"0000"+IC_Number,
              slot_Number: this.slotArray[i].slot
            }

            this.Slot.create(slot).subscribe(resp=> {
              console.log(this.Slot)

              this.slotArray = [];

            }, error=> {
              console.log(error)
            })

          
          }

          const notify = {
            rid: IC_Number,
            title: 'New Vendor Added Name: '+name, 
            description: 'New vendor has been successfully added name '+name+'\n with IC Number: '+IC_Number,
            category: 'New Vendor Added: '+name,
            date: this.date,
            view: false
          };

          this.notification.create(notify).subscribe(data=> {
            console.log("notification created")
          },error=> {
            console.log(error)
          })

          console.log(data)  
          this.name="";
          this.email="";
          this.phone="";
          this.IC_Number="";
          this.rent_Date="";
          this.forIC="";
          this.slot="";
          this.slotprice="";
          this.registrationForm.reset();
          Swal.fire('Success','Data have been saved','success')
        },
        error=> {
          console.log(error)
          Swal.fire('Please try again','Cannot Create vendor, please check your phone number and try again!','error')
        })

        } else {

          Swal.fire('Please try again!','IC Number is already existed','error')
          return;

        }
        
      }, async err=> {

      

      });

      
      
      
    }
   
  }

  
  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }

  addSlot(){
    var slot = this.registrationForm.value.slot;

    if (slot !==""){

      var slotNo = {
        slot: slot
      }

      this.Slot.findBySlot(slot).subscribe(data=> {
        console.log (data);
        this.slotNumber = data;

        if (this.slotNumber.length == 0){
          this.slotArray.push(slotNo);
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
    this.slotArray.splice(i,1);
  }


  // async showAlert(header:string, message:string){
  //   const alert = await this.alert.create({

  //     header,
  //     message,
  //     buttons: ["Ok"]

  //   })

  //   await alert.present()
    

  // }

}
