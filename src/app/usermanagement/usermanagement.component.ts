import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import Swal from 'sweetalert2';
import { NotificationComponent } from '../notification/notification.component';
import { accountService } from '../services/account.service';
import { attachmentService } from '../services/Attachment.service';
import { notificationService } from '../services/notification.service';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermanagementComponent implements OnInit {

 
  fileUploadForm: FormGroup;
  fileInputLabel: string

  close: any;
  opened = true
  notifyData: any = [];
  notifyNo: any;
  link: any;
  username: any;
  role: string;
  action = "http://localhost:3000/upload-Profile"

  constructor(
    private router: Router,
    private slidePanel: MatSlidePanel,
    private notification: notificationService,
    private attachment: attachmentService,
    private http: HttpClient,
    private account: accountService,
    private formBuilder: FormBuilder

  ) {
    this.close = false;
   }

  ngOnInit(): void {

    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    })
    this.notifyNumber()

    this.username = localStorage.getItem("username")
    this.role = localStorage.getItem("role");
  }

  onFileSelect(event){
    const fileValue = event.target.files[0];
    this.fileInputLabel = fileValue.name;
    this.fileUploadForm.value.uploadedImage = fileValue;
    console.log(this.fileUploadForm.value.uploadedImage)
  }

  upload(){
    if (!this.fileUploadForm.value.uploadedImage){
      Swal.fire('Upload Failed','Please Try again','error')
    } else {
      console.log(this.fileUploadForm.value.uploadedImage)
      const formData = new FormData()
      formData.append('image',this.fileUploadForm.value.uploadedImage);
      formData.append('vendor_rid','123')
      formData.append('account_rid','111');

      // this.attachment.uploadFile(formData).subscribe(data=> {
      //   console.log(data)
      // })


      this.http
      .post<any>('http://localhost:3000/uploadfile',formData).subscribe(response => {
        console.log(response);
        if (response.statusCode === 200) {
          this.fileInputLabel = undefined;
        }
      }, er => {
        console.log(er);
        alert(er.error.error);
      });
    }
  }

  openNav(){
    this.close = false;
    this.opened = true;
  }

  closeNav(){
    this.opened = false;
    this.close = true;
  }

  goToDashboard(){
    this.router.navigate(['/dashboard'])
  }

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    }).afterDismissed().subscribe(data=> {
      this.notifyNumber();
    })
  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }

  change(file){

    this.link = file.target.files[0];

  }

  submit(){

    const username = "Amirulrosli";
    const password = "Amirulrosli133@";
    const email = "meerros8100@gmail.com";
    const IC_Number = "01-119328"
    const role = "Administrator"
    var newDate = new Date();
    const last_login = newDate;


    var account1 = {
      username: username,
      password: password,
      email: email,
      IC_Number: IC_Number,
      role: role,
      last_Login: last_login
    }

    this.account.createAccount(account1).subscribe(data=> {
      console.log(data)
    }, error=> {
      console.log(error)
    })




  //   try{

  //     this.attachment.create(attachment).subscribe(data=> {
  //       console.log(data)
  //     },error=> {
  //       console.log( error)
  //     })

  //   } catch (error){
  //     console.log(error)
  //   }



  }

}
