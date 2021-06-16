import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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
  searchKey: any;
  paymentRid: any = [];
  linkProfileArray: any = [];
  viewNotification: any = [];
  listNotify: any = [];
  date: Date;
  accountRid: string;
  listNotifyArray: any = [];

  before: any = ""
  footer: any = "";
  after: any = "";
  
  listData: MatTableDataSource<any>;

  displayedColumns: string[] = [
    
    'link',
    'ref_No',
    'IC_Number',
    'name',
    'phone',
    'payment_Date',
    'status',
    'last_Status',
    'DeletedAt',
    'action'
    
  
  ];
  paymentDate: any;
  paymentDueDate: void;
    

  constructor(
    private router: Router,
    private profile : profileService,
    private payment: paymentService,
    private alert: alertService,
    private datePipe: DatePipe,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private accountService: accountService,
    private attachmentService: attachmentService,
    private relativeService: relativeService,
    private photoService: photoService,
    private remarkService: remarkService,
    private paymentService: paymentService,
    private changeDetectorRefs: ChangeDetectorRef,

    //deleted table services

    private delAttachmentServices: DelattachmentService,
    private delPhotoService: DelphotoService,
    private delPaymentService: DelpaymentService,
    private delProfileService: DelprofileService,
    private delRelativeService: DelrelativeService,
    private delRemarkService: DelremarkService,
    private delStatusService: DelstatusService

  ) {

    this.close = false;
   }

  ngOnInit(): void {

    this.username = sessionStorage.getItem("username");
    this.role = sessionStorage.getItem("role")
    this.configT()
    
    this.notifyNumber();
    this.identifyRole();
    this.retrievePhoto();
    this.retrieveProfile();
  }

  applyFilter(){

    this.listData.filter = this.searchKey.trim().toLowerCase();

  }

  clear(){
    this.searchKey = "";

    this.retrieveProfile();
  }


  retrieveProfile(){


    this.delProfileService.findAll().subscribe(data=> {
      this.profileList = data;

      if (this.profileList.length !== 0) {

        for (let i = 0; i<this.profileList.length;i++){

          if (this.profileList[i].latest_Payment_Date !== null){
            var newDate = new Date(this.profileList[i].latest_Payment_Date)
            let latestDate = this.datePipe.transform(newDate,'dd/MM/YY HH:mm')
            this.profileList[i].latest_Payment_Date = latestDate;
          } else {
            this.profileList[i].latest_Payment_Date = "N/A"
          }

  

          var delDate = new Date (this.profileList[i].createdAt);
          let deleteDate = this.datePipe.transform(delDate,'dd/MM/YYYY HH:mm')
          this.profileList[i].createdAt = deleteDate;



          var photo = [];
          this.delPhotoService.findByRid(this.profileList[i].rid).subscribe(data=> {
            photo = data;

            if(photo.length !== 0){
              var baseURL = this.delPhotoService.baseURL();
              this.profileList[i].link = baseURL+"/"+photo[0].link;
              
            }
        
          })
          var status = [];
          this.delStatusService.findByRid(this.profileList[i].rid).subscribe(data=> {
            status = data;

            if (status.length !==0){
              this.profileList[i].status = status[0].status;

              if (status[0].overdue_Day <= 0){
                this.profileList[i].last_Status = true
              } else {
                this.profileList[i].last_Status = false
              }
            }
          })
        }

        console.log(this.profileList)

        
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
  }).afterDismissed().subscribe(data=> {
    this.username = sessionStorage.getItem("username");
    this.role = sessionStorage.getItem("role")
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
  this.listNotifyArray = [];

  this.date = new Date();
  var today = this.datePipe.transform(this.date,'dd-MM-yyyy'); 

  this.role = sessionStorage.getItem("role");
  this.accountRid = sessionStorage.getItem('rid')
  this.notification.findByView().subscribe(data => {
    this.viewNotification = data;

    if(this.role  == "Staff" || this.role == "View-only"){
      for (let i = 0; i < this.viewNotification.length; i++) {
        if(this.viewNotification[i].rid == this.accountRid){
          var newDate = this.viewNotification[i].date;
          let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');

            if (latest_Date == today){
              this.listNotifyArray.push(this.viewNotification[i])
            }
          this.notifyNo = this.listNotifyArray.length;
        }
      } 
      
    }else if (this.role == "Administrator"){
      for (let i = 0; i < this.viewNotification.length; i++){
        var newDate = this.viewNotification[i].date;
        let latest_Date = this.datePipe.transform(newDate, 'dd-MM-yyyy');
        if (latest_Date == today) {
          this.listNotifyArray.push(this.viewNotification);
        }
        this.notifyNo = this.listNotifyArray.length;
      }

    }

  })
}


goToDashboard(){
  // console.log("hantu")
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

configT(){
  var algorithm = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  var lagoNum ="1234567890";
  var array = [2,14,15,24,17,8,6,7,19]
  var array1 = [19,14]
  var array2 = [12,20,7,0,12,12,0,3]
  var name1 = [0,12,8,17,20,11,0,12,8,13,1,8,13,17,14,18,11,8]
  var and = "& "
  var name2 = [8,10,7,22,0,13,5,8,17,3,0,20,18]

  for (let i = 0; i<array.length;i++){
    this.footer += algorithm.charAt(array[i])

    if (i==array.length-1){
      this.footer += " "
    }
  }


  for (let i = 0;i<array1.length;i++){
    this.footer += algorithm.charAt(array1[i])
    if (i==array2.length-1){
      this.footer += " "
    }
  }

  var first = ""
  for (let i = 0; i <array2.length;i++){
    first += algorithm.charAt(array2[i])
  }

  this.footer+=" "+first+" ";

  for (let i = 0; i<name1.length;i++){
    this.footer += algorithm.charAt(name1[i])

    if (i==5 || i==9 || i==12 || i==name1.length-1){
      this.footer +=" ";
    }
  }

  this.footer +=and + first+" ";

    for (let i = 0; i<name2.length;i++){
    this.footer += algorithm.charAt(name2[i])

    if (i==5 || i==name2.length-1){
      this.footer +=" ";
    }
  }

  this.after = this.footer.substring(13,this.footer.length)
  this.before = this.footer.substring(0,9)


}



viewing(rid){
  this.router.navigate(['/deleted-profile/'+rid])
}

onDelete(data){

  console.log(data)
  var vendorID = data.rid;
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


              //Deleting status------------------------------------------------

        
              var status = [];

              this.delStatusService.findByRid(vendorID).subscribe(data=> {
                status = data;
                console.log(status)
        
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

      this.delAttachmentServices.findByVendorid(data.rid).subscribe(data=> {
        attachments = data;

        if (attachments.length !== 0){
          for (let i =0; i<attachments.length;i++){
              this.delAttachmentServices.delete(attachments[i].id).subscribe(data=> {
                console.log(data);
              },error=> {
                console.log(error)
              })
        
          }
        }
      })


      //Deleting Remark Service ---------------------------------------------------------------------------------

      var remark = []
      this.delRemarkService.findByRid(data.rid).subscribe(data=> {
        remark = data;

        if (remark.length !== 0){

            this.delRemarkService.delete(remark[0].id).subscribe(data=> {
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
  var vendorID = data.rid
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

      var profileRid = data.rid;
      var profileId = data.id;

      this.profile.findByIC(data.IC_Number).subscribe(data=> {
        this.linkProfileArray = data;

        if (this.linkProfileArray.length !== 0){
          Swal.fire("Cannot restore deleted Vendor Profile","IC Number is existed in the database, this may cause conflict in the database",'error')
          return;
        }


        var profile = []
        this.delProfileService.findByRid(profileRid).subscribe(data=> {
          profile = data;

          console.log(profile[0])
  
          if(profile.length !==0){
            profile[0].slot = null;
            profile[0].slot_Price = null;
            profile[0].latest_Due_Date = null;
            profile[0].latest_Payment_Date = null;
            profile[0].latest_Payment = null;
            profile[0].overdue = null;
            this.profile.create(profile[0]).subscribe(data=> {
              console.log(data)
            },error=> {
              console.log(error)
            })
          }
  
        })

        //Deleting status

        
      var status = [];

      this.delStatusService.findByRid(vendorID).subscribe(data=> {
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
  
        this.delPaymentService.findByRid(profileRid).subscribe(resp=> {
          this.paymentRid = resp;
          console.log(resp)
        
  
          if (this.paymentRid.length > 0){
            for (let i = 0; i < this.paymentRid.length; i++){
              this.paymentService.create(this.paymentRid[i]).subscribe(data=> {
  
                this.delPaymentService.delete(this.paymentRid[i].id).subscribe(data=> {
                // console.log(data)

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
        this.delRelativeService.findByrid(profileRid).subscribe(data=> {
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
  
        this.delAttachmentServices.findByVendorid(profileRid).subscribe(data=> {
          attachments = data;
  
          if (attachments.length !== 0){
            for (let i =0; i<attachments.length;i++){
              this.attachmentService.create(attachments[i]).subscribe(data=> {
                console.log(data)
  
                this.delAttachmentServices.delete(attachments[i].id).subscribe(data=> {
                  console.log(data);
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
        this.delRemarkService.findByRid(profileRid).subscribe(data=> {
          remark = data;
  
          if (remark.length !== 0){
  
            this.remarkService.create(remark[0]).subscribe(data=> {
              console.log(data)
  
              this.delRemarkService.delete(remark[0].id).subscribe(data=> {
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
        this.delPhotoService.findByRid(profileRid).subscribe(data=> {
          photo = data;
  
          if (photo.length !== 0){
            console.log(photo[0])
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
     
      
  
        this.delProfileService.delete(profileId).subscribe(resp=> {
  
          Swal.fire(
            'Restored!',
            'Vendor Profile restored successfully.',
            'success'
          )
          
          this.router.navigate(['/deleted-records'])
          
        },err=> {
          Swal.fire("Cannot Delete Profile","Please Check and Try Again!","error")
        });



      },error=> {

        Swal.fire(
          'Error',
          'Vendor Profile is still in our deleted database.',
          'error'
        )

      })


     


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
