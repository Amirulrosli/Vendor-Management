import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SLIDE_PANEL_DATA } from 'ngx-mat-slide-panel';
import { accountService } from '../services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Router } from '@angular/router';
import { loginStateService } from '../services/loginState.service';
import { photoService } from '../services/photo.service';
import Swal from 'sweetalert2';
import { MatSlidePanel } from 'ngx-mat-slide-panel';





@Component({
  selector: 'app-side-profile',
  templateUrl: './side-profile.component.html',
  styleUrls: ['./side-profile.component.scss']
})
export class SideProfileComponent implements OnInit {

  username: any
  role: any
  IC: any
  ID: any
  userData: any
  photoArray: any = [];
  profilePhoto:any;
  profileID: any;
 

  list:any;
  retrieveData: any = [];
  rid: string;
  updateAccount: any;
  



  constructor(
    @Inject(MAT_SLIDE_PANEL_DATA) public data: any,
    private account : accountService,
    private dialog: MatDialog,
    private router: Router,
    private accountService: accountService,
    private loginState: loginStateService,
    private photoService: photoService,
    private slidePanel: MatSlidePanel,



  ) { }

  ngOnInit(): void {
    console.log(this.data.dataKey.role)
    this.username = this.data.dataKey.username;
    this.role = this.data.dataKey.role;
    this.IC = this.data.dataKey.IC_Number;
    this.userData = this.data.dataKey

    this.retrievePhoto();
  }

  getUser(){
    this.account.findAll().subscribe(array=> {
      this.retrieveData = array
   
      this.list = array.map(item=> {
       
        return{
          id: item.id,
          ...item as Account
        }
      });
    })
  }

  onEdit(){
    
    this.dialog.open(EditUserComponent, {
      width: "600px",
      height: "90%",
      panelClass: 'edit-modalbox',
      data: {
        dataKey: this.userData
      }
    }).afterClosed().subscribe(data=> {
      this.getUser();
      this.retrievePhoto();
    })
  
}

goToDashboard(){
  this.router.navigate(["/dashboard"]);
}

goToNotifications(){
  this.slidePanel.dismiss();
  this.router.navigate(["/allnotification"]);
}

logout(){

  // this.accountService.update(this.updateAccount.id,this.updateAccount).subscribe(data=> {

  // })
  
  this.rid = sessionStorage.getItem("rid")

  this.loginState.findByRid(this.rid).subscribe(data =>{
    this.updateAccount = data[0] 
    console.log(this.updateAccount.id)

    var loginState = {
      id : this.updateAccount.id,
      rid : this.updateAccount.rid,
      login_state : false
    }
  
    this.loginState.update(this.updateAccount.id, loginState).subscribe(data => {
      console.log(data)
      sessionStorage.clear();
      Swal.fire({
        title: 'User Logged Out',
        // text: 'Please Log in',
        imageUrl: 'assets/AISimple.png',
        imageHeight:280,
        imageWidth:350
      })
      this.slidePanel.dismiss();
      this.router.navigate(['/login']);
      // window.location.reload();
      
      // this.authGuard.getState(this.updateAccount.rid)
    })
  })

  



}


retrievePhoto(){
  var accountRID = sessionStorage.getItem('rid');
  this.photoService.findByRid(accountRID).subscribe(data=> {
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

}
