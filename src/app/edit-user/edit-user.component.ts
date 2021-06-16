import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { accountService } from '../services/account.service';
import { notificationService } from '../services/notification.service';
import { photoService } from '../services/photo.service';

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
  fileInputLabel: string;
  fileUploadForm:any;
  photoArray: any = [];
  profilePhoto: any;
  profileID:any = "";


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
  accountRole: any;
  isAdmin: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formbuilder: FormBuilder,
    private dialog: MatDialog,
    private accountService: accountService,
    private photoService: photoService,
    private notification: notificationService
  ) { }

  ngOnInit(): void {

    //.log(this.data.dataKey)


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

    this.retrievePhoto();
    this.identifyRole();


  }

   //identify if user is admin
   identifyRole(){
    this.accountRole = sessionStorage.getItem("role")

    if (this.accountRole == "Administrator") {
      //.log(this.accountRole)
      this.isAdmin = true;
    } else{
      this.isAdmin = false;
    }

    if (this.accountRole == "View-only") {
      this.isAdmin = false;
      // this.viewOnly = true;
    }


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
    const newDate = new Date();
    //.log(id)

    var account = {
      username: username,
      password: password,
      email: email,
      IC_Number: IC_Number,
      role: role,
      rid: this.data.dataKey.rid,
      last_Login: newDate,
    }

    //.log(account)

    this.accountService.findByUsername(username).subscribe(data=> {
      this.usernameArray = data;




      if (this.usernameArray.length == 0){
        var localaccount = sessionStorage.getItem('username');

        if (localaccount==this.data.dataKey.username){
          sessionStorage.removeItem('username');
          sessionStorage.setItem('username',username);
        }

        //notify
      
        var accountRid = sessionStorage.getItem('rid');
        var date = new Date();
        // console.log(this.locationName)

        const notify = {
          rid: accountRid,
          title: 'Account info updated for'+' '+username, 
          description: 'Account info update for account with \n the username: '+username,
          category: 'Account Info Updated',
          date: date,
          view: false
        };

        this.notification.create(notify).subscribe(data=> {                     //create notification
          console.log("notification created")
        },error=> {
          console.log(error)
        })
       

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
            //.log(result)
            Swal.fire("Account Updated","Successfully update the user account","success")
            //notify
         
           var accountRid = sessionStorage.getItem('rid');
            var date = new Date();
            

            const notify = {
              rid: accountRid,
              title: 'Account info updated for'+' '+username, 
              description: 'Account info update for account with \n the username: '+username,
              category: 'Account Info Updated',
              date: date,
              view: false
            };

            this.notification.create(notify).subscribe(data=> {                     //create notification
              console.log("notification created")
            },error=> {
              console.log(error)
            })
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
