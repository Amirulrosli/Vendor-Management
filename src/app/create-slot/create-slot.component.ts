import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { locationService } from '../services/location.service';
import { slotService } from '../services/slot.service';

@Component({
  selector: 'app-create-slot',
  templateUrl: './create-slot.component.html',
  styleUrls: ['./create-slot.component.scss']
})
export class CreateSlotComponent implements OnInit {

  locationArray:any = []
  slotForm: FormGroup

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
    private slotService: slotService
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
          this.slotService.create(slot).subscribe(resp=> {
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
