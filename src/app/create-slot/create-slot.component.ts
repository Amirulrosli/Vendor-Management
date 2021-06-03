import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { locationService } from '../services/location.service';
import { notificationService } from '../services/notification.service';
import { slotService } from '../services/slot.service';

@Component({
  selector: 'app-create-slot',
  templateUrl: './create-slot.component.html',
  styleUrls: ['./create-slot.component.scss']
})
export class CreateSlotComponent implements OnInit {

  locationArray:any = []
  slotForm: FormGroup
  slotArray: any = [];
  dataArray: any = []

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
    private locationService: locationService,
    private dialog: MatDialog,
    private formbuilder: FormBuilder,
    private slotService: slotService,
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

  submit(){

    if(!this.slotForm.valid){
      Swal.fire('Process Failed','Please check and try again!','error')
      return;
    } else {

      const location = this.slotForm.value.location;
      const slot_Number = this.slotForm.value.slot_Number;
      const slot_Price = this.slotForm.value.slot_Price;
      const taken = false;

      console.log(location)

      var slot = {
        slot_Number: slot_Number,
        slot_Price: slot_Price,
        location: location,
        taken: taken
      }

      var slotArray = [];

      this.slotService.findBySlot(slot_Number).subscribe(data=> {
        slotArray = data;

        console.log(slotArray)

        if (slotArray.length == 0){
          
          //notify
          var accountRid = localStorage.getItem('rid');
          var date = new Date();
          // console.log(location);
          // console.log(slot_Number);

          const notify = {
            rid: accountRid,
            title: 'New Slot Added for: '+' '+location, 
            description: 'New Slot added \n for the location '+location+' with the the number: '+slot_Number,
            category: 'New Slot Added',
            date: date,
            view: false
          };

          this.notification.create(notify).subscribe(data=> {                     //create notification
            console.log("notification created")
          },error=> {
            console.log(error)
          })

          this.slotService.create(slot).subscribe(resp=> {

            //update total slot  - location table

            this.slotService.findByLocation(this.slotForm.value.location).subscribe(data=> {
              this.slotArray = data;
              console.log(slotArray)
              this.locationService.findByLocation(this.slotForm.value.location).subscribe(data=> {
                this.dataArray = data;
                console.log(this.dataArray)
                this.dataArray[0].total_Slot = this.slotArray.length;
                this.locationService.update(this.dataArray[0].id, this.dataArray[0]).subscribe(resp=> {
                  console.log(resp)
                }, error=> {
                  console.log(error)
                })
              },error=> {
                console.log(error)
              })
            },error=> {
              console.log(error)
            })





            console.log(resp);
            Swal.fire('Slot Added','Successfully add slot to the database','success');
            this.dialog.closeAll();
            return;
          })
        }

        Swal.fire('Slot is already available in the Database','Please check and try again!','error')
        return;


      },error=> {
        Swal.fire('Cannot Add slot','Please check and try again!','error')
        return;
      })


    }
  }

}
