import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { accountService } from '../services/account.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  value: any;
  myRoles: any;
  accountForm: FormGroup;
  profileName: any;
  usernameArray: any = [];


  public errorMessages = {
    username: [
      { type: 'required', message: 'Name is required' },
      { type: 'maxlength', message: 'Name cant be longer than 100 characters' }
    ],

    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Please enter a valid email address' }
    ],

    IC_Number: [
      { type: 'required', message: 'Identification number is required' },
      { type: 'pattern', message: 'Please enter a valid IC number' },
      { type: 'maxlength', message: 'Please enter 6 number for the Identification number' },
      { type: 'minlength', message: 'Please enter 6 number for the Identification number' }
    ],

    forIC: [

      { type: 'required', message: 'First two number is required' }

    ],

    password: [

      { type: 'required', message: 'Password is required' },

    ],
    repassword: [

      { type: 'required', message: 'Password is required' },

    ],

    role: [

      { type: 'required', message: 'Role is required' },


    ],

    
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private accountService: accountService
  ) { }

  ngOnInit(): void {

    console.log(this.data.dataKey)


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

    this.myRoles = [
      {
        role: "Administrator"
      },
      {
        role: "Staff"
      },
      {
        role: "View-only"
      }
    ]


    this.accountForm = this.formbuilder.group({
      username: ['',[Validators.required,Validators.maxLength(100)]],
      forIC: ['',[Validators.required]],
      IC_Number:['',[Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$'), Validators.minLength(6), Validators.maxLength(6)]],
      email: ['',[Validators.required,Validators.pattern('^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$')]],
      password:['',[Validators.required]],
      repassword:['',[Validators.required]],
      role:['',[Validators.required]],
    }, {validator: this.matchingPassword('password','repassword')});

    this.profileName = this.data.dataKey.username;
    const subIC = this.data.dataKey.IC_Number;
    const forIC = subIC.substring(0,2);
    const IC_Number = subIC.substring(3,9);


    var account = {
      username: this.profileName,
      forIC: forIC,
      IC_Number: IC_Number,
      email: this.data.dataKey.email,
      role: this.data.dataKey.role,
      password: this.data.dataKey.password,
      repassword: this.data.dataKey.password
    }

    this.accountForm.setValue(account);




  }


  matchingPassword(passwordkey, confirmpasswordKey){
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordkey];
    let confirmPassword = group.controls[confirmpasswordKey];

  if (password.value !== confirmPassword.value) {
    return {
      mismatchedPasswords: true
    };
  }
    }
}


closeModal(){
  this.dialog.closeAll();
}

saveChanges(){

  if (!this.accountForm.valid){
    Swal.fire("Incomplete Field","Please check and try again","error")
    return;
  } else {

    if (this.accountForm.value.password !== this.accountForm.value.repassword){
      Swal.fire("Repeated Password is incorrect","Please check and try again","error")
      return;
    }

    const username = this.accountForm.value.username;
    const password = this.accountForm.value.password;
    const email = this.accountForm.value.email;
    const role = this.accountForm.value.role;
    const IC_Number = this.data.dataKey.IC_Number
    const id = this.data.dataKey.id;
    console.log(id)

    var account = {
      username: username,
      password: password,
      email: email,
      IC_Number: IC_Number,
      role: role,
      rid: this.data.dataKey.rid,
      last_Login: this.data.dataKey.last_Login,


    }

    console.log(account)

    this.accountService.findByUsername(username).subscribe(data=> {
      this.usernameArray = data;



      if (this.usernameArray.length == 0){

            this.accountService.update(id, account).subscribe(result=> {
              Swal.fire("Account Updated","Successfully update the user account","success")
              this.closeModal();
              return;
            },error=> {
              console.log(error)
              Swal.fire("Cannot update the user account [1]","Please check your details and try again","error")
              return;
            })


      } else {

        if (username == this.data.dataKey.username){
          
          this.accountService.update(id, account).subscribe(result=> {
            console.log(result)
            Swal.fire("Account Updated","Successfully update the user account","success")
            this.closeModal();
            return;
          },error=> {
            console.log(error)
            Swal.fire("Cannot update the account [2]","Please check your details and try again","error")
            return;
          })
        }
        else {
          Swal.fire("Failed to create user account","Existed Username and please try again","error")
          return;
        }
      
      }

    }, error=> {
        Swal.fire("Cannot update account","Please check your details and try again","error")
        return;
    }); // Find Existed Username

  }

}











}
