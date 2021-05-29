import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { accountService } from '../services/account.service';
import { alertService } from '../services/Alert.service';
import { notificationService } from '../services/notification.service';
import { paymentService } from '../services/payment.service';
import { photoService } from '../services/photo.service';
import { profileService } from '../services/profile.service';
import { DelattachmentService } from '../servicesDeleted/Attachment.service';
import { DelpaymentService } from '../servicesDeleted/payment.service';
import { DelphotoService } from '../servicesDeleted/photo.service';
import { DelprofileService } from '../servicesDeleted/profile.service';
import { DelrelativeService } from '../servicesDeleted/relative.service';
import { DelremarkService } from '../servicesDeleted/remark.service';
import { SideProfileComponent } from '../side-profile/side-profile.component';

@Component({
  selector: 'app-deleted-records',
  templateUrl: './deleted-records.component.html',
  styleUrls: ['./deleted-records.component.scss']
})
export class DeletedRecordsComponent implements OnInit {


  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  username: any;
  role: any;
  profileArray: any;
  isAdmin;
  accountRole: any;
  viewOnly: any;
  photoArray: any = [];
  profilePhoto:any;
  profileID: any;
  close: any;
  opened = true
  notifyNo: any;
  notifyData:any;
  profileList: any = [];
  
  listData: MatTableDataSource<any>;

  displayedColumns: string[] = [
    
    
    'IC_Number',
    'name',
    'email',
    'phone',
    'slot',
    'payment_Date',
    'action'
    
  
  ];
    

  constructor(
    private router: Router,
    private profile : profileService,
    private payment: paymentService,
    private alert: alertService,
    private datePipe: DatePipe,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private accountService: accountService,
    private photoService: photoService,
    private changeDetectorRefs: ChangeDetectorRef,

    //deleted table services

    private delAttachmentServices: DelattachmentService,
    private delPhotoService: DelphotoService,
    private delPaymentService: DelpaymentService,
    private delProfileService: DelprofileService,
    private delRelativeService: DelrelativeService,
    private delRemarkService: DelremarkService

  ) {

    this.close = false;
   }

  ngOnInit(): void {

    this.username = localStorage.getItem("username");
    this.role = localStorage.getItem("role")
    
    this.notifyNumber();
    this.identifyRole();
    this.retrievePhoto();
    this.retrieveProfile();
  }


  retrieveProfile(){

    this.delProfileService.findAll().subscribe(data=> {
      this.profileList = data;

      if (this.profileList.length !== 0) {

        for (let i = 0; i<this.profileList.length;i++){
          var newDate = new Date(this.profileList[i].latest_Payment_Date)
          let latestDate = this.datePipe.transform(newDate,'dd/MM/YY HH:mm')
          this.profileList[i].latest_Payment_Date = latestDate;
          var photo = [];
          this.delPhotoService.findByRid(this.profileList[i].rid).subscribe(data=> {
            photo = data;

            if(photo.length !== 0){
              var baseURL = this.delPhotoService.baseURL();
              this.profileList[i].link = baseURL+"/"+photo[0].link;
            }
        
          })
        }

        
        this.listData = new MatTableDataSource(this.profileList);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.changeDetectorRefs.detectChanges();




      }

    },error=> {
      console.log(error)
    })

  }

  
openSideProfile(id){
    
  console.log(id)

  this.slidePanel.open(SideProfileComponent, {
    slideFrom:'right',
    panelClass: "edit-modalbox1",
    data: {
      dataKey: id,
    }
  })

}


retrieveID(username){
this.accountService.findByUsername(username).subscribe(data=> {
  this.profileArray = data;
  console.log(this.profileArray)
  const id = this.profileArray[0].id;
  this.openSideProfile(this.profileArray[0]);
})

}

retrievePhoto(){
var accountRID = localStorage.getItem('rid');
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

public notifyNumber(){
  this.notification.findByView().subscribe(data=> {
      this.notifyData = data;
      this.notifyNo = this.notifyData.length;
  })
}


goToDashboard(){
  console.log("hantu")
  this.router.navigate(["/dashboard"]);
}

openNav(){
  this.close = false;
}

closeNav(){
  this.close = true;
}

openNotification(){
  this.slidePanel.open(NotificationComponent, {
    slideFrom:'right'
  })
}


identifyRole(){
  this.accountRole = localStorage.getItem("role")

  if (this.accountRole == "Administrator") {
    console.log(this.accountRole)
    this.isAdmin = true;
  } else{
    this.isAdmin = false;
  }

  if (this.accountRole == "View-only") {
    this.isAdmin = false;
    this.viewOnly = true;
  }


}

viewing(rid){
  this.router.navigate(['/deleted-profile/'+rid])
}


}
