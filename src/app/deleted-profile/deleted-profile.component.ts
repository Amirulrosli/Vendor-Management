import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import Swal from 'sweetalert2';
import { NotificationComponent } from '../notification/notification.component';
import { accountService } from '../services/account.service';
import { alertService } from '../services/Alert.service';
import { attachmentService } from '../services/Attachment.service';
import { notificationService } from '../services/notification.service';
import { paymentService } from '../services/payment.service';
import { photoService } from '../services/photo.service';
import { profileService } from '../services/profile.service';
import { relativeService } from '../services/relative.service';
import { remarkService } from '../services/remark.service';
import { DelattachmentService } from '../servicesDeleted/Attachment.service';
import { DelstatusService } from '../servicesDeleted/delStatus.service';
import { DelpaymentService } from '../servicesDeleted/payment.service';
import { DelphotoService } from '../servicesDeleted/photo.service';
import { DelprofileService } from '../servicesDeleted/profile.service';
import { DelrelativeService } from '../servicesDeleted/relative.service';
import { DelremarkService } from '../servicesDeleted/remark.service';
import { SideProfileComponent } from '../side-profile/side-profile.component';

@Component({
  selector: 'app-deleted-profile',
  templateUrl: './deleted-profile.component.html',
  styleUrls: ['./deleted-profile.component.scss']
})
export class DeletedProfileComponent implements OnInit {

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
  rid: any;

  attachmentDataArray: any = [];
  paymentArray:any = [];
  relativeArray: any = [];
  proPicArray: any = [];
  RemarksArray: any = [];
  profilePic: any;
  vendorname: any;
  email:any;
  descriptionRemarks:any;
  searchKey: any;


  showRemarks = false;
  showProfile = false;
  showPayment = true;
  showAttachment = false;
  showSpouse = false;

  buttonColor1 = '#b366ff';
  color1 = '#ffffff';

  buttonColor2 = '#ffffff';
  buttonColor3 = '#ffffff';
  buttonColor4 = '#ffffff';
  buttonColor5 = '#ffffff';

  color2 = '#919191'
  color3 ='#919191'
  color4 = '#919191'
  color5 = '#919191'

  displayedColumns: string[] = [
    'paymentID',
    'payment_Date',
    'due_Date',
    'price',
    'send_Email',
    'email'
  
  ];

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  paymentData: any;
  initialAttachment: any;
  dateFilter: any;
  vendorIC: any;
  contract: any;
  phoneNo: any;
  rent_Date: any;
  address: any;
  profileLocation:any;
  slot: any;
  price:any;
  paymentRid: any =[];
  profileData: any;

  



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
    private remarkService: remarkService,
    private profileService: profileService,
    private attachmentService: attachmentService,
    private relativeService: relativeService,
    private paymentService: paymentService,
    private route: ActivatedRoute,


    //deletedRecords---------------------------

    private delAttachmentService: DelattachmentService,
    private delPaymentService: DelpaymentService,
    private delPhotoService: DelphotoService,
    private delRelativeService: DelrelativeService,
    private delRemarksService: DelremarkService,
    private delProfileService: DelprofileService,
    private location: Location,
    private sanitizer: DomSanitizer,
    private delStatusService: DelstatusService
    
  ) { }

  ngOnInit(): void {

    this.rid = this.route.snapshot.paramMap.get('rid');
    console.log(this.rid)
    this.showPayment = true;

    this.username = sessionStorage.getItem("username");
    this.role = sessionStorage.getItem("role")
    
    this.notifyNumber();
    this.identifyRole();
    this.retrievePhoto();
    this.getProfilePhoto();
    this.retrieveAttachment();
    this.retrieveProfiles();
    this.retrievePayment();
    this.retrieveRelatives();
    this.retrieveRemarks();
  

  }


  transform(url: string) {
    if (!url) return null;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  applyFilter(){
    this.paymentData.filter = this.searchKey.trim().toLowerCase();
  }

  clearSearch(){
    this.searchKey = "";
    this.paymentData.filter = this.searchKey.trim().toLowerCase();
  }


  getProfilePhoto(){

    this.delPhotoService.findByRid(this.rid).subscribe(data=> {
      console.log(data)
      this.proPicArray = data;

      if (this.proPicArray.length !== 0){
        var baseURL = this.delPhotoService.baseURL();
        var link = baseURL+"/"+this.proPicArray[0].link;
        this.profilePic = link;

      }
    },error=>{
      console.log(error)
    })
    

  }

  retrieveAttachment() {

    this.delAttachmentService.findByVendorid(this.rid).subscribe(data=> {
      this.initialAttachment = data;
     
      if (this.initialAttachment.length !== 0){
        var Link = "";
        for(let i = 0; i<this.initialAttachment.length; i++){
          var baseURL = this.delAttachmentService.baseURL();
          Link = baseURL+"/"+this.initialAttachment[i].link;
          this.initialAttachment[i].link = Link;
  
          if (this.initialAttachment[i].type !== "image/png" || this.initialAttachment[i].type !== "image/jpg" || this.initialAttachment[i].type !== "image/jpeg" || this.initialAttachment[i].type !== "image/gif" ){
            this.initialAttachment[i].application = true;
          } else {
            this.initialAttachment[i].application = false;
          }
        }
  
        console.log(this.initialAttachment)
        this.attachmentDataArray = this.initialAttachment;
      } else {
        this.attachmentDataArray = [];
      }
  
    },error=> {
      console.log(error)
    })
  }

  retrieveProfiles(){
    this.delProfileService.findByRid(this.rid).subscribe(data=> {
      this.profileList = data;
      if (this.profileList.length !==0){
        this.profileData = this.profileList[0];
        this.vendorname = this.profileList[0].name;
        this.email = this.profileList[0].email;
        this.phoneNo = this.profileList[0].phone;
        this.address = this.profileList[0].address;
        this.vendorIC = this.profileList[0].IC_Number;
        this.rent_Date = this.profileList[0].rent_Date;

        if (this.profileList[0].contract == true){
          this.contract = "Contract"
        } else {
          this.contract = "Non-contract"
        }
      }
    },error=> {
      console.log(error)
    })
  }

  retrievePayment(){

    this.delPaymentService.findByRid(this.rid).subscribe(data=> {
      this.paymentArray = data;

      if (this.paymentArray !==0){

        for (let i = 0; i<this.paymentArray.length;i++){
          var newDate = new Date(this.paymentArray[i].payment_Date);
          var dueDate = new Date (this.paymentArray[i].due_Date);
          let latestNewDate = this.datePipe.transform(newDate,'dd/MM/YYYY HH:mm');
          let latestDueDate = this.datePipe.transform(dueDate, 'dd/MM/YYYY HH:mm')

          this.paymentArray[i].payment_Date = latestNewDate;
          this.paymentArray[i].due_Date = latestDueDate;
        }
        this.paymentData = new MatTableDataSource(this.paymentArray);
        this.paymentData.sort = this.sort;
        this.paymentData.paginator = this.paginator;
      }

    },error=> {
      console.log(error)
    })

  }

  retrieveRelatives(){
    this.delRelativeService.findByrid(this.rid).subscribe(data=> {
      this.relativeArray = data;
    },error=> {
      console.log(error)
    })

  }

  retrieveRemarks(){

    this.delRemarksService.findByRid(this.rid).subscribe(data=> {
      this.RemarksArray = data;

      if (this.RemarksArray.length !== 0){
        this.descriptionRemarks= this.RemarksArray[0].Description;
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
  }).afterDismissed().subscribe(data=> {
    this.username = sessionStorage.getItem("username");
    this.role = sessionStorage.getItem("role")
  })

}

onChange(data){

  const date = data;
  const year = date.substring(0,4);
  const month = date.substring(5,7);
  const day = date.substring(8,10);
  const fullDate = day+"/"+month+"/"+year;

  this.paymentData.filter = fullDate.trim().toLowerCase();
}

clear(){
  this.dateFilter = "";
  this.paymentData.filter = this.dateFilter.toLowerCase();
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
  this.accountRole = sessionStorage.getItem("role")

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

back(){
  this.location.back();
}



goToPayment(){
  this.showPayment = true;
  this.showProfile = false;
  this.showAttachment = false;
  this.showRemarks = false;
  this.showSpouse = false;
  
  this.buttonColor1 = '#b366ff';
  this.color1 = '#ffffff';

  this.buttonColor2 = '#ffffff';
  this.buttonColor3 = '#ffffff';
  this.buttonColor4 = '#ffffff';
  this.buttonColor5 = '#ffffff';

  this.color2 = '#919191'
  this.color3 ='#919191'
  this.color4 = '#919191'
  this.color5 = '#919191'

  
}

goToFullProfile(){

  this.showProfile = true;
  this.showPayment = false;
  this.showAttachment = false;
  this.showRemarks = false;
  this.showSpouse = false;

  this.buttonColor2 = '#b366ff';
  this.color2 = '#ffffff';

  this.buttonColor1 = '#ffffff';
  this.buttonColor3 = '#ffffff';
  this.buttonColor4 = '#ffffff';
  this.buttonColor5 = '#ffffff';

  this.color1 = '#919191'
  this.color3 = '#919191'
  this.color4 = '#919191'
  this.color5 = '#919191'

}


goToSpouse(){

  this.showSpouse = true;
  this.showProfile = false;
  this.showPayment = false;
  this.showAttachment = false;
  this.showRemarks = false;

  
  this.buttonColor3 = '#b366ff';
  this.color3 = '#ffffff';

  this.buttonColor1 = '#ffffff';
  this.buttonColor2 = '#ffffff';
  this.buttonColor4 = '#ffffff';
  this.buttonColor5 = '#ffffff';

  this.color1 ='#919191'
  this.color2 = '#919191'
  this.color4 = '#919191'
  this.color5 = '#919191'
  
  this.retrieveRelatives();

}


goToAttachment(){

  this.showAttachment = true;
  this.showProfile = false;
  this.showPayment = false;
  this.showRemarks = false;
  this.showSpouse = false;
  
  this.buttonColor4 = '#b366ff';
  this.color4 = '#ffffff';

  this.buttonColor1 = '#ffffff';
  this.buttonColor2 = '#ffffff';
  this.buttonColor3 = '#ffffff';
  this.buttonColor5 = '#ffffff';

  this.color1 = '#919191'
  this.color2 = '#919191'
  this.color3 = '#919191'
  this.color5 = '#919191';

  this.retrieveAttachment();

}

goToRemarks(){
  this.showRemarks = true;
  this.showProfile = false;
  this.showPayment = false;
  this.showAttachment = false;
  this.showSpouse = false;
  
  this.buttonColor5 = '#b366ff';
  this.color5 = '#ffffff';

  this.buttonColor1 = '#ffffff';
  this.buttonColor2 = '#ffffff';
  this.buttonColor3 = '#ffffff';
  this.buttonColor4 = '#ffffff';

  this.color1 = '#919191'
  this.color2 = '#919191'
  this.color3 = '#919191'
  this.color4 = '#919191';

  this.retrieveRemarks();
}


openFile(data){
  window.open(data)
}

onDelete(data){

  console.log(data)
  var rid = sessionStorage.getItem('rid');
  var accName = sessionStorage.getItem('username')
  

  Swal.fire({
    title: 'Are you sure',
    text: 'Permanently delete this profile from the database',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'

  }).then((result) => {

    if (result.value) {
      const date = new Date();
      const notify = {
        rid: rid,
        title: 'Permanently Deleted Vendor Profile: '+' '+data.name, 
        description: 'Deleted Vendor profile with \n name: '+data.name+'\n Account ID: '+data.rid+'\n was permanently deleted by '+accName,
        category: 'Deleted vendor profile (Permanent)',
        date: date,
        view: false
      };

      this.notification.create(notify).subscribe(resp=> {
        
      },error=> {
        console.log(error)
      });



      //Deleting Payment Service --------------------------------------------------------------------

      this.delPaymentService.findByRid(data.rid).subscribe(resp=> {
        this.paymentRid = resp;
      

        if (this.paymentRid.length > 0){
          for (let i = 0; i < this.paymentRid.length; i++){
 
              this.delPaymentService.delete(this.paymentRid[i].id).subscribe(data=> {
                console.log(data);
              }, error=> {
                console.log(error)
              })
          }
        }
      }, err=> {
        console.log(err)
      })

      //Status delete -----------------------------------------------------------------------

      var status = [];

      this.delStatusService.findOne(data.rid).subscribe(data=> {
        status = data;

        if (status.length !== 0){

          this.delStatusService.delete(status[0].id).subscribe(data=> {
            console.log(data)
          },error=> {
            console.log(error)
          })
        }

      },error=> {
        console.log(error)
      })

      //Deleting Payment Service -----------------------------------------------------------------------------

      var relative = [];
      this.delRelativeService.findByrid(data.rid).subscribe(data=> {
        relative = data;

        if (relative.length !== 0){

          for (let i = 0; i<relative.length; i++){
   
              this.delRelativeService.delete(relative[i].id).subscribe(data=> {
                console.log(data)
              },error=> {
                console.log(error)
              })
          }
        }
      })

      //Deleting Attachment Service ---------------------------------------------------------------------------

      var attachments = [];

      this.delAttachmentService.findByVendorid(data.rid).subscribe(data=> {
        attachments = data;

        if (attachments.length !== 0){
          for (let i =0; i<attachments.length;i++){
              this.delAttachmentService.delete(attachments[i].id).subscribe(data=> {
                console.log(data);
              },error=> {
                console.log(error)
              })
        
          }
        }
      })


      //Deleting Remark Service ---------------------------------------------------------------------------------

      var remark = []
      this.delRemarksService.findByRid(data.rid).subscribe(data=> {
        remark = data;

        if (remark.length !== 0){

            this.delRemarksService.delete(remark[0].id).subscribe(data=> {
              console.log(data)
            }, error=> {
              console.log(error)
            })

        
        }
      })


      //Deleting Photo Service ----------------------------------------------------------------------------------

      var photo = []
      this.delPhotoService.findByRid(data.rid).subscribe(data=> {
        photo = data;

        if (photo.length !== 0){

            this.delPhotoService.delete(photo[0].id).subscribe(data=> {
              console.log(data)
            }, error=> {
              console.log(error)
            })
      
        }
      })



      //Deleting profile Service ---------------------------------------------------------------------------------
   
    

      this.delProfileService.delete(data.id).subscribe(resp=> {

        Swal.fire(
          'Removed!',
          'Deleted Vendor Profile removed successfully.',
          'success'
        )
        
        this.router.navigate(['/deleted-records'])
        
      },err=> {
        Swal.fire("Cannot Delete Profile","Please Check and Try Again!","error")
      });


    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Vendor Profile is still in our deleted database.',
        'error'
      )
    }
  });

}


onRestore(data){

  console.log(data)
  
  var rid = sessionStorage.getItem('rid');
  var accName = sessionStorage.getItem('username')

  Swal.fire({
    title: 'Are you sure to restore this profile?',
    text: 'Restore this deleted vendor profile from deleted',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No'

  }).then((result) => {

    if (result.value) {
      const date = new Date();
      const notify = {
        rid: rid,
        title: 'Deleted Profile Restored'+' '+data.name, 
        description: 'Deleted Vendor profile with \n name: '+data.name+'\n Account ID: '+data.rid+'\n was restored by '+accName,
        category: 'Deleted vendor profile',
        date: date,
        view: false
      };

      this.notification.create(notify).subscribe(resp=> {
        
      },error=> {
        console.log(error)
      });


      var profile = []
      this.delProfileService.findByRid(data.rid).subscribe(data=> {
        profile = data;

        if(profile.length !==0){
          profile[0].slot = null;
          profile[0].slot_Price = null;
          profile[0].latest_Due_Date = null;
          profile[0].latest_Payment_Date = null;
          profile[0].latest_Payment = null;
          profile[0].overdue = null;
          this.profileService.create(profile[0]).subscribe(data=> {
            console.log(data)
          },error=> {
            console.log(error)
          })
        }

      })


      //Deleting Status Service --------------------------------------------------------------------


      var status = [];

      this.delStatusService.findOne(data.rid).subscribe(data=> {
        status = data;

        if (status.length !== 0){

          this.delStatusService.delete(status[0].id).subscribe(data=> {
            console.log(data)
          },error=> {
            console.log(error)
          })
        }

      },error=> {
        console.log(error)
      })


      //Deleting Payment Service --------------------------------------------------------------------

      this.delPaymentService.findByRid(data.rid).subscribe(resp=> {
        this.paymentRid = resp;
      

        if (this.paymentRid.length > 0){
          for (let i = 0; i < this.paymentRid.length; i++){
            this.paymentService.create(this.paymentRid[i]).subscribe(data=> {
           

              this.delPaymentService.delete(this.paymentRid[i].id).subscribe(data=> {
               
              }, error=> {
                console.log(error)
              })

            },error=> {
              console.log(error)
            })
           
          }
        }
      }, err=> {
        console.log(err)
      })


      //Deleting Payment Service -----------------------------------------------------------------------------

      var relative = [];
      this.delRelativeService.findByrid(data.rid).subscribe(data=> {
        relative = data;

        if (relative.length !== 0){

          for (let i = 0; i<relative.length; i++){
            this.relativeService.createRelative(relative[i]).subscribe(data=> {
              console.log(data)
              this.delRelativeService.delete(relative[i].id).subscribe(data=> {
                console.log(data)
              },error=> {
                console.log(error)
              })

            },error=> {
              console.log(error)
            })
        
          }
        }
      })

      //Deleting Attachment Service ---------------------------------------------------------------------------

      var attachments = [];

      this.delAttachmentService.findByVendorid(data.rid).subscribe(data=> {
        attachments = data;

        if (attachments.length !== 0){
          for (let i =0; i<attachments.length;i++){
            this.attachmentService.create(attachments[i]).subscribe(data=> {
          

              this.delAttachmentService.delete(attachments[i].id).subscribe(data=> {
                
              },error=> {
                console.log(error)
              })


            },error=> {
              console.log(error)
            })
        
          }
        }
      })


      //Deleting Remark Service ---------------------------------------------------------------------------------

      var remark = []
      this.delRemarksService.findByRid(data.rid).subscribe(data=> {
        remark = data;

        if (remark.length !== 0){

          this.remarkService.create(remark[0]).subscribe(data=> {
            console.log(data)

            this.delRemarksService.delete(remark[0].id).subscribe(data=> {
              console.log(data)
            }, error=> {
              console.log(error)
            })


          },error=> {
            console.log(error)
          })
        
        }
      })


      //Deleting Photo Service ----------------------------------------------------------------------------------

      var photo = []
      this.delPhotoService.findByRid(data.rid).subscribe(data=> {
        photo = data;

        if (photo.length !== 0){
          this.photoService.create(photo[0]).subscribe(data=> {
            console.log(data);

            this.delPhotoService.delete(photo[0].id).subscribe(data=> {
              console.log(data)
            }, error=> {
              console.log(error)
            })

          },error=> {
            console.log(error)
          })
      
        }
      })



      //Deleting profile Service ---------------------------------------------------------------------------------
   
    

      this.delProfileService.delete(data.id).subscribe(resp=> {

        Swal.fire(
          'Restored!',
          'Vendor Profile restored successfully.',
          'success'
        )
        
        this.router.navigate(['/deleted-records'])
        
      },err=> {
        Swal.fire("Cannot Delete Profile","Please Check and Try Again!","error")
      });


    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Vendor Profile is still in our deleted database.',
        'error'
      )
    }
  });

}


















}
