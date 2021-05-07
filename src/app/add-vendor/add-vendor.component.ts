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
import { relativeService } from '../services/relative.service';
import { MatTabGroup } from '@angular/material/tabs';
import { locationService } from '../services/location.service';


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
  username: any;
  role: any;
  stepTwo: Boolean = true;
  stepThree: Boolean = true;
  childArray: any = [];
  childDataArray: any = [];
  locationArray: any =[]
  locationField: any = "Select Location...";
  priceArray: any;

  public errorMessages = {
    name: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],

    address: [
      { type: 'required', message: 'Address is required' },
      { type: 'maxlength', message: 'Address cant be longer than 100 characters' }
    ],

    spouseName: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],

    childName: [
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
    spouseIC_Number: [
      { type: 'required', message: 'Identification number is required' },
      { type: 'pattern', message: 'Please enter a valid IC number' },
      { type: 'maxlength', message: 'Please enter 6 number for the Identification number' },
      { type: 'minlength', message: 'Please enter 6 number for the Identification number' }
    ],

    childIC_Number: [
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

    chIC: [

      { type: 'required', message: 'First two number is required' }

    ],
    spIC: [

      { type: 'required', message: 'First two number is required' }

    ],

    slot: [

      { type: 'required', message: 'Slot is required' }

    ],
    slotprice: [

      { type: 'required', message: 'Slot price is required' }

    ],

    location: [

      { type: 'required', message: 'Location is required' }

    ],

    
    
  };
  
  

  constructor(private router: Router,
    private profile : profileService,
    private datePipe: DatePipe,
    private formbuilder: FormBuilder,
    private alert: alertService,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private Slot: slotService,
    private relativeService: relativeService,
    private locationService: locationService

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

    
    this.username = localStorage.getItem("username");
    this.role = localStorage.getItem("role")
    
    this.registrationForm = this.formbuilder.group({
      name: ['',[Validators.required,Validators.maxLength(100)]],
      address: ['',[Validators.required,Validators.maxLength(100)]],
      forIC: ['',[Validators.required]],
      IC_Number:['',[Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
      email: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      phone:['',[Validators.required]],
      rent_Date: ['',[Validators.required]],
      slot:['',[Validators.required]],
      slotprice:['',[Validators.required]],
      spouseName: ['',[Validators.required,Validators.maxLength(100)]],
      spIC: ['',[Validators.required]],
      spouseIC_Number:['',[Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
      childName: ['',[Validators.maxLength(100)]],
      chIC: [''],
      childIC_Number:[''],
      location: ['',[Validators.required]]
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

    this.getLocation();

  }

  getLocation(){
    this.locationService.findAll().subscribe(data=> {
      this.locationArray = data;
      console.log(this.locationArray)

      if(this.locationArray == 0){
        this.locationField = "No Location Found..."
      }
    },error=> {
      console.log("error"+error)
    })
  }

  showSlot(){
    const location = this.registrationForm.value.location;
    var slotData = [];
    this.slotArray = [];
    this.Slot.findByLocation(location).subscribe(data=> {
      slotData = data;
      if(slotData.length == 0){
        this.slotArray = [];
      } 

      for(let i = 0; i<slotData.length; i++){

        if (slotData[i].taken == false){
          this.slotArray.push(slotData)
        }

      }

    }, error=> {
      console.log(error)
    })
  }

  showPrice(){
    const slot_Number = this.registrationForm.value.slot;

    this.Slot.findBySlot(slot_Number).subscribe(data=> {
      this.priceArray = data;
      this.registrationForm.value.slotprice = this.priceArray[0].slot_Price;
      this.registrationForm.controls['slotprice'].setValue(this.priceArray[0].slot_Price);

    },error=> {
      console.log(error)
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

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    })
  }

  async submit(){

    if (this.slotArray.length == 0 || this.childArray.length == 0){
      Swal.fire("Unsuccessful","Please Enter your child details!",'error')
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
      const address = this.registrationForm.value.address;

      const spouseName = this.registrationForm.value.spouseName;
      const spIC = this.registrationForm.value.spIC;
      const nextSpIC= this.registrationForm.value.spouseIC_Number;
      const spouseIC_Number = spIC+"-"+nextSpIC;
      const contract = this.registrationForm.value.contract;

      this.profile.findByIC(IC_Number).subscribe(async data=> {
        console.log(data)
        this.ICData = data;

        if (this.ICData.length == 0) {

        var slotNumber = "";
        const date_Now = new Date();
        let today = date_Now.getDate()+""+(date_Now.getMonth()+1)+""+date_Now.getFullYear();
        console.log(this.slotArray)
        

          var profileModel = {
            name: name,
            email: email,
            rent_Date: rent_Date,
            phone: phone,
            IC_Number: IC_Number,
            slot_Price: slot_Price,
            slot: slot,
            address:address,
            contract: contract
          }
        
        
        var profileList = [];
    
        await this.profile.create(profileModel).subscribe(data=> { //Start save to database

          profileList = data;
          console.log(data)
          const rid = profileList.rid;
          const taken = true;
          var slotData = [];

          var relative = {
            rid: rid,
            name: spouseName,
            IC_Number: spouseIC_Number,
            relationship: "spouse"
          }

          this.relativeService.createRelative(relative).subscribe(data=> {  //save spouse
            console.log("spouse successfully created")
          },error=> {
            console.log(error)
          })

          for (let i = 0; i<this.childArray;i++){                           //Save Child array
            this.childArray[i].rid = rid;

            this.relativeService.createRelative(this.childArray[i]).subscribe(data=> {
              console.log("Child successfully created")
            },error=> {
              console.log(error)
            })
          }

          this.Slot.findBySlot(slot).subscribe(data=> {                     //find slot
            slotData = data;

            if (slotData.length == 0){
              Swal.fire("Slot is not found","Please check and try again","error")
              return;
            }

        

            var slotModel = {
              rid: rid,
              taken: taken,
              slot_Price: slot_Price,
              slot_Number: slot,

            }

            this.Slot.update(slotData[0].id,slotModel).subscribe(data=> {                //update Slot
              console.log(data)
            }, err=> {
              console.log(err)
              return;
            })
          }, error=> {
            console.log(error)
            return;
          })
          

          const notify = {
            rid: IC_Number,
            title: 'New Vendor Added Name: '+name, 
            description: 'New vendor has been successfully added name '+name+'\n with IC Number: '+IC_Number,
            category: 'New Vendor Added: '+name,
            date: this.date,
            view: false
          };

          this.notification.create(notify).subscribe(data=> {                     //create notification
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
        
        
        Swal.fire('Please try again!','Cannot create profile to the database','error')
        return;

      });

      
      
      
    }
   
  }

  
  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }


  AddChild(){

    const childName = this.registrationForm.value.childName;
    const chIC = this.registrationForm.value.chIC;
    const childIC_Number = this.registrationForm.value.childIC_Number;
    const IC_Number = chIC+"-"+childIC_Number;

    var exp = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");


 

    if(childName !== "" && chIC !=="" && childIC_Number !== ""){

      if (exp.test(childIC_Number) && childIC_Number.length == 6){
        
        var child = {
          rid: "",
          name: childName,
          IC_Number: IC_Number,
          relationship: "child"
        }
  
        this.relativeService.findByIC(IC_Number).subscribe(data=> {
          this.childDataArray = data;
  
          if(this.childDataArray.length == 0){
            this.childArray.push(child);
            this.registrationForm.value.childName = "";
            this.registrationForm.value.chIC = "";
            this.registrationForm.value.childIC_Number = "";
            this.registrationForm.controls['childName'].reset();
            this.registrationForm.controls['chIC'].reset();
            this.registrationForm.controls['childIC_Number'].reset();
          } else {
            console.log("Existed Child")
            Swal.fire('Cannot Add Child '+child.name,'child is already existed in the database, Please Try Again','error')
          }
        })

      } else {
        Swal.fire("Incorrect Format","Please check your IC Number and try again",'error')
      }

    } else {
      Swal.fire("Cannot Add Child, Empty Field","Please Fill in the field to add child",'error')
    }

  }

  clearChild(i){
    this.childArray.splice(i,1);
  }

  tabClick(tabGroup: MatTabGroup){
    if(!tabGroup || !(tabGroup instanceof MatTabGroup)){
      return
    }

    const tabCount = tabGroup._tabs.length;
    tabGroup.selectedIndex = (tabGroup.selectedIndex+1) % tabCount;
    console.log(tabGroup.selectedIndex)

    if(tabGroup.selectedIndex == 0){
      this.stepTwo = false;
    } else if (tabGroup.selectedIndex == 1){
      this.stepThree = false;
    }
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
