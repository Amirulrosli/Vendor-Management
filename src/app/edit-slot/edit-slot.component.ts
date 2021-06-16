import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { locationService } from '../services/location.service';
import { notificationService } from '../services/notification.service';
import { profileService } from '../services/profile.service';
import { slotService } from '../services/slot.service';

@Component({
  selector: 'app-edit-slot',
  templateUrl: './edit-slot.component.html',
  styleUrls: ['./edit-slot.component.scss']
})
export class EditSlotComponent implements OnInit {


  locationArray:any = []
  slotForm: FormGroup
  slotArray: any = [];
  dataArray: any = [];
  takenSlot: any;
  profileArray: any = [];

  public errorMessages = {
    slot_Price: [
      { type: 'required', message: 'Price is required' },
    ],

    slot_Number: [
      { type: 'required', message: 'Slot Number is required' },
      { type: 'maxlength', message: 'Slot Number cant be longer than 100 characters' }
    ],

    location: [
      { type: 'required', message: 'Location is required' },
    ],


  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private locationService: locationService,
    private dialog: MatDialog,
    private formbuilder: FormBuilder,
    private slotService: slotService,
    private profileService: profileService,
    private notification: notificationService
  

    
  ) {


    
   }

  ngOnInit(): void {

    this.slotForm = this.formbuilder.group({
      slot_Number: ['',[Validators.required,Validators.maxLength(100)]],
      slot_Price:['',[Validators.required]],
      location:['',[Validators.required]],
    })



    this.refreshLocation();

    var slot = {
      slot_Number: this.data.dataKey.slot_Number,
      slot_Price: this.data.dataKey.slot_Price,
      location: this.data.dataKey.location,
    }



    this.slotForm.setValue(slot);

    this.takenSlot = this.data.dataKey.taken;
  }


  refreshLocation(){
    this.locationService.findAll().subscribe(data=> {
      this.locationArray = data;
    },error=> {
      console.log(error)
    })
  }

  
  closeModal(){



    this.dialog.closeAll();

  }

  changeLocation(){

  
    const location = this.slotForm.value.location; 

    var locationArray = []
    this.locationService.findByLocation(this.data.dataKey.location).subscribe(data=> {
      locationArray = data;

      if (locationArray.length !== 0){

        var number = parseInt(locationArray[0].total_Slot);
        var calculate = number-1;
        locationArray[0].total_Slot =calculate;

        this.locationService.update(locationArray[0].id,locationArray[0]).subscribe(data=> {
          var newLocationArray = [];

          this.locationService.findByLocation(location).subscribe(data=> {
            newLocationArray = data;

            var number = parseInt(newLocationArray[0].total_Slot);
            var calculate = number+1;
            newLocationArray[0].total_Slot =calculate;

            this.locationService.update(newLocationArray[0].id, newLocationArray[0]).subscribe(data=> {
              Swal.fire("Success","Slot has successfully updated",'success')
              this.closeModal();
              return;
            })
          })
        })
      }
    })
    
  }

  submit(){

    if (!this.slotForm.valid){
      Swal.fire('Cannot Edit Slot','Please check and try again','error');
      return;
    } else {
      const id = this.data.dataKey.id;
      const rid = this.data.dataKey.rid;
      const slot_Number = this.slotForm.value.slot_Number;
      const slot_Price = this.slotForm.value.slot_Price;
      const location = this.slotForm.value.location; 
      const taken = this.takenSlot;


      var slotData = {
        id:id,
        rid:rid,
        slot_Number: slot_Number,
        slot_Price: slot_Price,
        location: location,
        taken: taken
      }

    
      //notify
      var accountRid = sessionStorage.getItem('rid');
      var date = new Date();
      // console.log(location);
      // console.log(slot_Number);

      const notify = {
      rid: accountRid,
      title: 'Slot update for: '+' '+slot_Number, 
      description: 'New Slot details update \n for the location '+location+' with the the number: '+slot_Number,
      category: 'Slot Update',
      date: date,
      view: false
      };

      this.notification.create(notify).subscribe(data=> {                     //create notification
        console.log("notification created")
      },error=> {
        console.log(error)
      })

      if (taken){

        this.profileService.findByRid(rid).subscribe(data=> {
          this.profileArray = data;

          if (this.profileArray.length !== 0){

            this.profileArray[0].slot = slot_Number;
            this.profileArray[0].slot_Price = slot_Price;

            //.log(this.profileArray)

            this.profileService.update(this.profileArray[0].id, this.profileArray[0]).subscribe(data=> {

              if (slot_Number == this.data.dataKey.slot_Number){
             

                  this.slotService.update(id, slotData).subscribe(data=> {
        

                    if (location !== this.data.dataKey.location){
                      this.changeLocation();
                    } else {
                      Swal.fire('Success','Slot Details updated successfully','success');
                      this.closeModal();
                      return;
                    }


                  },error=> {
                    Swal.fire("Process Failed [2]","Please Check and try again",'error');
                    console.log(error)
                    return;
                  })

                
              } else {

                this.slotService.findBySlot(slot_Number).subscribe(data=> {
                  this.slotArray = data;

                  if (this.slotArray.length !== 0){
                    Swal.fire("Process Failed [5]","Slot Number is already existed in the database",'error');
                    return;

                  } else {
                    
                    this.slotService.update(id, slotData).subscribe(data=> {
                     

                      if (location !== this.data.dataKey.location){
                        this.changeLocation();
                      } else {
                        Swal.fire('Success','Slot Details updated successfully','success');
                        this.closeModal();
                        return;
                      }

                    },error=> {
                      Swal.fire("Process Failed [2]","Please Check and try again",'error');
                      console.log(error)
                      return;
                    })

                  }
                },error=> {
                  console.log(error)
                })

              }
             

            },error=> {
              Swal.fire("Process Failed [1]","Please Check and try again",'error');
              console.log(error)
              return;
            })


          }
        },error=> {
          Swal.fire("Process Failed [0]","Please Check and try again",'error');
          console.log(error)
          return;
        })




      } else {

        
        if (slot_Number == this.data.dataKey.slot_Number){
             

          this.slotService.update(id, slotData).subscribe(data=> {
         
            
            if (location !== this.data.dataKey.location){
              this.changeLocation();
            } else {
              Swal.fire('Success','Slot Details updated successfully','success');
              this.closeModal();
              return;
            }

          },error=> {
            Swal.fire("Process Failed [2]","Please Check and try again",'error');
            console.log(error)
            return;
          })

        
      } else {

        //.log(slot_Number)
        

        this.slotService.findBySlot(slot_Number).subscribe(data=> {
          this.slotArray = data;
          //.log(this.slotArray)
          

          if (this.slotArray.length !== 0){
            Swal.fire("Process Failed [5]","Slot Number is already existed in the database",'error');
            return;

          } else {
            
            this.slotService.update(id, slotData).subscribe(data=> {
             

              if (location !== this.data.dataKey.location){
                this.changeLocation();
              } else {
                Swal.fire('Success','Slot Details updated successfully','success');
                this.closeModal();
                return;
              }

            },error=> {
              Swal.fire("Process Failed [2]","Please Check and try again",'error');
              console.log(error)
              return;
            })

          }
        },error=> {
          console.log(error)
        })

      }

      }

    }

  }

}
