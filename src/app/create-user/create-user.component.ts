import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { accountService } from '../services/account.service';
import { loginStateService } from '../services/loginState.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  value: any;
  myRoles: any;
  accountForm: FormGroup
  usernameArray: any = [];
  ICArray: any = [];


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
  updateAccount: any;

  constructor(

    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private accountService: accountService,
    private loginStateService: loginStateService

  ) { 



  }

  ngOnInit(): void {

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
    }, {validator: this.matchingPassword('password','repassword')})


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


submit(){


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
    const forIC= this.accountForm.value.forIC;
    const nextIC = this.accountForm.value.IC_Number;
    const role = this.accountForm.value.role;

    const IC_Number = forIC+"-"+nextIC;



    var account = {
      username: username,
      password: password,
      email: email,
      IC_Number: IC_Number,
      role: role
    }

    console.log(account)

    this.accountService.findByUsername(username).subscribe(data=> {
      this.usernameArray = data;

      if (this.usernameArray.length == 0){
        this.accountService.findByIC(IC_Number).subscribe(result=> {
          this.ICArray = result;

          if (this.ICArray.length == 0){

            this.accountService.createAccount(account).subscribe(result=> {
              Swal.fire("Account Added","Successfully added user account","success")
              console.log(result)

              this.accountService.findByid(result.id).subscribe(data =>{
              
                var loginState = {
                  id : result.id,
                  rid : result.rid,
                  login_state : false
                }
              
                this.loginStateService.create(loginState).subscribe(data => {
                  console.log(data)
                })
              })

              this.closeModal();
              return;
            },error=> {
              Swal.fire("Cannot create account","Please check your details and try again","error")
              return;
            })


          } else {
            Swal.fire("IC Number is already Existed","Please change your IC Number and try again","error")
            return;
          }

        }, error=> {
          Swal.fire("Cannot create account","Please check your details and try again","error")
          return;
        }); //Find Existed IC Number


      } else {
        Swal.fire("Username is already Existed","Please change your username and try again","error")
        return;
      }

    }, error=> {
        Swal.fire("Cannot create account","Please check your details and try again","error")
        return;
    }); // Find Existed Username

  }
}


  closeModal(){
    this.dialog.closeAll();
  }

}
