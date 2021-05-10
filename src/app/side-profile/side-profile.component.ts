import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MAT_SLIDE_PANEL_DATA } from 'ngx-mat-slide-panel';
import { accountService } from '../services/account.service';
import { MatDialog } from '@angular/material/dialog';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Router } from '@angular/router';



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
 

  list:any;
  retrieveData: any = [];



  constructor(
    @Inject(MAT_SLIDE_PANEL_DATA) public data: any,
    private account : accountService,
    private dialog: MatDialog,
    private router: Router

  ) { }

  ngOnInit(): void {
    console.log(this.data.dataKey.role)
    this.username = this.data.dataKey.username;
    this.role = this.data.dataKey.role;
    this.IC = this.data.dataKey.IC_Number;
    this.userData = this.data.dataKey
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
      this.getUser()
    })
  
}

goToDashboard(){
  this.router.navigate(["/dashboard"]);
}

}
