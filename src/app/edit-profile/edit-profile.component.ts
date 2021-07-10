import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { profileService } from '../services/profile.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { notificationService } from '../services/notification.service';
import { Location } from '@angular/common';
import { slotService } from '../services/slot.service';
import { locationService } from '../services/location.service';
import { photoService } from '../services/photo.service';

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
  username: any = [];
  locationArray: any = [];
  locationField: any;
   priceArray: any = []
  slotDataArray: any = [];
  slotField:any;
  slotEmpty: any;
  compareLocation: any;
  slotCompare: any = []
  oldSlotArray: any = []
  fileInputLabel: string;
  fileUploadForm:any;
  photoArray: any = [];
  profilePhoto: any;
  profileID:any = "";
  


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
    address: [

      { type: 'required', message: 'Address is required' }

    ],
    contract: [

      { type: 'required', message: 'contract is required' }

    ],
    location: [

      { type: 'required', message: 'location is required' }

    ],
    ref_No: [

      { type: 'required', message: 'Reference Number is required' }

    ],
    
  };
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private formbuilder: FormBuilder,
  private dialog: MatDialog,
  private profile: profileService,
  private notification: notificationService,
  private location: Location,
  private Slot: slotService,
  private locationService: locationService,
  private photoService: photoService
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

    //.log(this.data.dataKey)
    
    

    this.registrationForm = this.formbuilder.group({
      name: ['',[Validators.required,Validators.maxLength(100)]],
      forIC: ['',[Validators.required],],
      IC_Number:['',[Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
      email: ['',[Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      phone:['',[Validators.required]],
      rent_Date: ['',[Validators.required]],
      slot:[''],
      slotprice:['',[Validators.required]],
      address:['',[Validators.required]],
      contract: ['',[Validators.required]],
      location:['',[Validators.required]],
      ref_No:['',[Validators.required]]
    })
    const IC_No = this.data.dataKey.IC_Number;
    const forIC = IC_No.substring(0,2);
    const IC_Number = IC_No.substring(3,9);
    this.username = this.data.dataKey.name;

    var editProfile= {
      ref_No: this.data.dataKey.ref_No,
      name: this.data.dataKey.name,
      forIC: forIC,
      IC_Number: IC_Number,
      email: this.data.dataKey.email,
      phone: this.data.dataKey.phone,
      rent_Date: this.data.dataKey.rent_Date,
      slot: this.data.dataKey.slot,
      slotprice: this.data.dataKey.slot_Price,
      address: this.data.dataKey.address,
      contract: this.data.dataKey.contract,
      location: ""
      
    }

    if (this.data.dataKey.slot !== null){

      this.Slot.findBySlot(this.data.dataKey.slot).subscribe(data=> {
        this.slotDataArray = data[0];
        editProfile.location = this.slotDataArray.location;
        this.compareLocation = this.slotDataArray.location;
        
        this.registrationForm.setValue(editProfile)
      
  
  
        this.slotField = this.slotDataArray.slot_Number;
        this.registrationForm.controls['slot'].setValue(this.slotField);
        this.getLocation();
        this.showSlot();
  
      })

    } else {

      this.registrationForm.setValue(editProfile);
      this.getLocation();
      this.showSlot();

      
    }



    this.retrievePhoto();

    


  }


  // retrieveSlot(){
  //   this.Slot.findByRid(this.data.dataKey.rid).subscribe(data=> {
      
  //     this.slotRetrieved = data;
  //     this.slotRetrievedLength = this.slotRetrieved.length;
  //     this.slotArray = this.slotRetrieved;
  //     console.log(this.slotArray)
  //     console.log(this.slotRetrieved)
  //   }, error=> {
  //     console.log(error)
  //   })
  // }

  closeModal(){

    this.dialog.closeAll();

  }

  resetSlot(){

    this.Slot.findBySlot(this.data.dataKey.slot).subscribe(data=> {
      this.slotDataArray = data[0];
      var location = this.slotDataArray.location;
      this.registrationForm.controls['location'].setValue(location);

      this.slotField = this.slotDataArray.slot_Number;
      //.log(this.slotField)
      this.registrationForm.controls['slot'].setValue(this.slotField);
      this.registrationForm.controls['slotprice'].setValue(this.slotDataArray.slot_Price)

      this.getLocation();

    })
  }


  getLocation(){

    //.log(this.registrationForm.value.slot)

    this.locationField = this.registrationForm.value.location;

    this.locationService.findAll().subscribe(data=> {
      this.locationArray = data;
      

      if(this.locationArray == 0){
        this.locationField = "No Location Found..."
      }
    },error=> {
      console.log("error"+error)
    })
  }

  showSlot(){
    const location = this.registrationForm.value.location;
    this.slotData = [];
    this.slotArray = [];
    if(this.compareLocation !== location){

      this.registrationForm.controls['slotprice'].setValue("");
      this.registrationForm.controls['slot'].setValue("");

    }

    this.Slot.findByLocation(location).subscribe(data=> {
      this.slotData = data;

      if (this.slotData == null){
        this.slotArray = [];
        return;

      } else if(this.slotData.length == 0){
        this.slotArray = [];
        return;
      } 

      for(let i = 0; i<this.slotData.length; i++){

        //.log(this.slotData[i].taken)

        if (!this.slotData[i].taken){
          this.slotArray.push(this.slotData[i])
        }

      }

      //.log(this.slotArray)

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



  async submit(){


    if(this.registrationForm.value.slot  == ""){
      Swal.fire("Unsuccessful","Cannot leave slot empty and please try again!",'error')
      return;
    }

    

    if(!this.registrationForm.valid){
      Swal.fire("Unsuccessful","Please Check and try again!",'error')
      return;
    } else {

      const name = this.registrationForm.value.name;
      var email = this.registrationForm.value.email;

      
      if (!email){
        email = "N/A";
      }

      const rent_Date = this.data.dataKey.rent_Date;
      const phone = this.registrationForm.value.phone;
      const IC_Number = this.data.dataKey.IC_Number;
      const address = this.registrationForm.value.address;
      const slot_Price = this.registrationForm.value.slotprice;
      const slot = this.registrationForm.value.slot;
      const contract = this.registrationForm.value.contract;
      const location = this.registrationForm.value.location;
      const ref_No = this.registrationForm.value.ref_No;

      this.date_Now = new Date();
      this.today = this.date_Now.getDate()+""+(this.date_Now.getMonth()+1)+""+this.date_Now.getFullYear();
      

      var profileModel = {
        ref_No: ref_No,
        id: this.data.dataKey.id,
        rid: this.data.dataKey.rid,
        name: name,
        email: email,
        rent_Date: rent_Date,
        address: address,
        contract: contract,
        phone: phone,
        IC_Number: IC_Number,
        slot_Price: slot_Price,
        slot: slot,
        latest_Payment: this.data.dataKey.latest_Payment,
        latest_Payment_Date: this.data.dataKey.latest_Payment_Date,
        latest_Due_Date: this.data.dataKey.latest_Due_Date,
        overdue: this.data.dataKey.overdue,
      }

      if (this.data.dataKey.ref_No == ref_No){ //if refNo is equal to datakey == just update

             

      this.profile.update(profileModel.id,profileModel).subscribe(data=> {


        if (slot !== this.data.dataKey.slot){
          //.log(this.data.dataKey.slot)

          this.Slot.findBySlot(this.data.dataKey.slot).subscribe(data=> {
            this.oldSlotArray = data;

            if (this.oldSlotArray.length !== 0){

              var oldModel = {
                id: this.oldSlotArray[0].id,
                rid: null,
                slot_Number: this.oldSlotArray[0].slot_Number,
                location: this.oldSlotArray[0].location,
                taken: false,
              }
  
              this.Slot.update(oldModel.id,oldModel).subscribe(data=> {
                console.log("update old done")
              })
              
            }

         
          })
        }



        this.Slot.findBySlot(slot).subscribe(data=> {
          this.slotCompare = data[0];

          var slotModel ={
            id: this.slotCompare.id,
            rid: this.data.dataKey.rid,
            slot_Number: slot,
            location: location,
            taken: true,
          }

          if (this.slotCompare.length !==0){


            this.Slot.update(slotModel.id, slotModel).subscribe(data=> {
              var date = new Date();
              var accountRID = sessionStorage.getItem('rid');
              const notify = {
                rid: accountRID,
                title: 'Profile Account Update for'+' '+this.data.dataKey.name, 
                description: 'Vendor profile has been updated to '+profileModel.name+'\n with Account ID: '+profileModel.rid,
                category: 'Updated vendor profile',
                date: date,
                view: false
              };
        
              this.notification.create(notify).subscribe(resp=> {
                //.log(resp)

                this.registrationForm.reset();
                Swal.fire('Success','Data have been saved','success')
                this.dialog.closeAll();


              },error=> {
                console.log(error)
              })

            },error=> {
              Swal.fire("Unsuccessful","Please Check and try again!",'error')
              return;
            })

          } else {

            Swal.fire("Unsuccessful","Please Check and try again!",'error')
            return;

          }

        },error=> {
          Swal.fire("Unsuccessful","Slot is not available",'error')
          return;
        })
      })

      } else { //if ref_No is not equal to datakey


        var refArray = []
        this.profile.findByReference(ref_No).subscribe(data=> {
          refArray  = data;

          if (refArray.length == 0){

                 

      this.profile.update(profileModel.id,profileModel).subscribe(data=> {


        if (slot !== this.data.dataKey.slot){
          //.log(this.data.dataKey.slot)

          this.Slot.findBySlot(this.data.dataKey.slot).subscribe(data=> {
            this.oldSlotArray = data;

            if (this.oldSlotArray.length !== 0){

              var oldModel = {
                id: this.oldSlotArray[0].id,
                rid: null,
                slot_Number: this.oldSlotArray[0].slot_Number,
                location: this.oldSlotArray[0].location,
                taken: false,
              }
  
              this.Slot.update(oldModel.id,oldModel).subscribe(data=> {
                console.log("update old done")
              })
              
            }

         
          })
        }



        this.Slot.findBySlot(slot).subscribe(data=> {
          this.slotCompare = data[0];

          var slotModel ={
            id: this.slotCompare.id,
            rid: this.data.dataKey.rid,
            slot_Number: slot,
            location: location,
            taken: true,
          }

          if (this.slotCompare.length !==0){


            this.Slot.update(slotModel.id, slotModel).subscribe(data=> {
              var date = new Date();
              var accountRID = sessionStorage.getItem('rid');
              const notify = {
                rid: accountRID,
                title: 'Profile Account Update for'+' '+this.data.dataKey.name, 
                description: 'Vendor profile has been updated to '+profileModel.name+'\n with Account ID: '+profileModel.rid,
                category: 'Updated vendor profile',
                date: date,
                view: false
              };
        
              this.notification.create(notify).subscribe(resp=> {
                //.log(resp)

                this.registrationForm.reset();
                Swal.fire('Success','Data have been saved','success')
                this.dialog.closeAll();


              },error=> {
                console.log(error)
              })

            },error=> {
              Swal.fire("Unsuccessful","Please Check and try again!",'error')
              return;
            })

          } else {

            Swal.fire("Unsuccessful","Please Check and try again!",'error')
            return;

          }

        },error=> {
          Swal.fire("Unsuccessful","Slot is not available",'error')
          return;
        })
      })

          } else {
            Swal.fire("Cannot update profile","Duplicated reference number, please change and try again!","error")
          }
        },error=> {
          console.log(error)
        })

      }

    }
   
  }



 


  onFileSelect(event){
    const fileValue = event.target.files[0];
    this.fileInputLabel = fileValue.name;
    this.fileUploadForm = fileValue;

    this.promptUpload();
  
  }

  promptUpload(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure to upload the selected Image?. Uploading may take less than 5 minutes',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'

    }).then((result)=> {
      if (result.value) {
        this.upload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Cancelling uploading process',
          'error'
        )
        return;
      }
    })
  }

  upload(){
    if (!this.fileUploadForm || this.fileUploadForm =="" || this.fileUploadForm == undefined){
      Swal.fire('Upload Failed','Please Try again','error')
    } else {
      //.log(this.fileUploadForm)
      var accountRID = sessionStorage.getItem('rid')

      if (this.profileID !== ""){
         this.photoService.delete(this.profileID).subscribe(data=> {
           console.log(data)
         })
      }
     
      const formData = new FormData()
      formData.append('image',this.fileUploadForm);
      formData.append('rid',this.data.dataKey.rid)

  
      this.photoService.upload(formData).subscribe(response => {
        //.log(response);
        if (response.statusCode === 200) {
          this.fileInputLabel = undefined;
        }
  
        Swal.fire("Success","Image has successfully uploaded",'success')
        this.fileUploadForm = "";
        this.retrievePhoto();
      }, er => {
        console.log(er);
        Swal.fire("Upload Failed",'Please Try Again','error');
        return;
      });
    }
  }


  retrievePhoto(){
    this.photoService.findByRid(this.data.dataKey.rid).subscribe(data=> {
      this.photoArray = data;

      if (this.photoArray.length !== 0){
        var baseURL = this.photoService.baseURL();
        this.profilePhoto = baseURL+"/"+this.photoArray[0].link;
        this.profileID = this.photoArray[0].id;
      }

    },error=> {
      console.log(error)
    })
  }

  deletePhoto(){

    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure to delete the selected Image?. Deleting may take less than 5 minutes',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'

    }).then((result)=> {
      if (result.value) {
        
        if (this.profileID !== ""){
          this.photoService.delete(this.profileID).subscribe(data=> {
            //.log(data)
            Swal.fire("Success","Image has successfully Delete",'success')
            this.retrievePhoto()
            return;
          })
       } else {

        Swal.fire("Success","Image has successfully Delete",'success')
        this.retrievePhoto()
        return;

       }



      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Cancelling uploading process',
          'error'
        )
        return;
      }
    })

  }


}



