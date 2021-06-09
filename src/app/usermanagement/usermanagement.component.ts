
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CreateSlotComponent } from '../create-slot/create-slot.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { EditSlotComponent } from '../edit-slot/edit-slot.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { NotificationComponent } from '../notification/notification.component';
import { Account } from '../services/account.model';
import { accountService } from '../services/account.service';
import { attachmentService } from '../services/Attachment.service';
import { backupService } from '../services/backup.service';
import { locationService } from '../services/location.service';
import { loginStateService } from '../services/loginState.service';
import { notificationService } from '../services/notification.service';
import { paymentService } from '../services/payment.service';
import { photoService } from '../services/photo.service';
import { profileService } from '../services/profile.service';
import { relativeService } from '../services/relative.service';
import { remarkService } from '../services/remark.service';
import { Slot } from '../services/slot.model';
import { slotService } from '../services/slot.service';
import { DelattachmentService } from '../servicesDeleted/Attachment.service';
import { DelpaymentService } from '../servicesDeleted/payment.service';
import { DelphotoService } from '../servicesDeleted/photo.service';
import { DelprofileService } from '../servicesDeleted/profile.service';
import { DelrelativeService } from '../servicesDeleted/relative.service';
import { DelremarkService } from '../servicesDeleted/remark.service';
import { SideProfileComponent } from '../side-profile/side-profile.component';


@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.scss']
})
export class UsermanagementComponent implements OnInit {

 //start User = true
  fileUploadForm: FormGroup;
  fileInputLabel: string
  searchKey:any;
  close: any;
  opened = true
  notifyData: any = [];
  notifyNo: any;
  backupURL:any;
  link: any;
  username: any;
  role: string;
  action = "http://localhost:3000/upload-Profile";
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateFilter: any;
  selectField: any = "All"
  findProfile: any = []

  displayedColumns: string[] = [
    
    'profile',
    'username',
    'id',
    'IC_Number',
    'email',
    'last_Login',
    'role',
    'action'
    
  
  ];


  //Start Slot = true
  buttonColor1: string = '#ff3333'
  buttonColor2: string = '#ffffff';
  buttonColor3: string = '#ffffff';
  color1: string = '#ffffff';
  color2: string = '#000000';
  color3: string = '#000000';
  listData: MatTableDataSource<any>;
  listSlotData: MatTableDataSource<any>;
  showUser: any = true;
  showSlot: any = false;
  showBackup: any = false;
  locationArray: any = [];
  locationName: any;
  newLocation: any;
  showEdit: any = false;
  number:any;
  slot:Slot
  slotArray: any = [];
  dataArray:any = []
  photoArray: any = [];
  paymentDataArray: any =[]
  profilePhoto:any;
  profileID: any;
  updateText: any="Click Run Backup to backing up data";
  viewNotification: any = [];
  listNotify: any = [];
  // date: Date;
  accountRid: string;
  listNotifyArray: any = [];
  date: any;



  displayedSlotColumns: string [] = [
    'id',
    'slot_Number',
    'slot_Price',
    'location',
    'taken',
    'action'
  ]

  list:any;
  retrieveData: any = [];
  profileArray: any;
  locationField: any = "All";
  relativeDataArray: any = [];
  attachmentDataArray: any = [];
  locationDataArray: any = [];
  slotDataArray: any = [];
  accountDataArray: any = [];
  loginStateDataArray: any = [];
  photoDataArray: any = [];
  noDataArray: any = [];
  remarkDataArray: any = [];

  //DeletedDatabase -----------------------------------
  delrelativeDataArray: any = [];
  delprofileDataArray: any = [];
  delpaymentDataArray: any = [];
  delphotoDataArray: any = [];
  delattachmentDataArray: any = [];
  delremarkDataArray: any = [];


  constructor(
    private router: Router,
    private slidePanel: MatSlidePanel,
    private notification: notificationService,
    private attachment: attachmentService,
    private http: HttpClient,
    private account: accountService,
    private formBuilder: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private dialog: MatDialog,
    private accountService: accountService,
    private locationService: locationService,
    private datePipe: DatePipe,
    private slotService: slotService,
    private photoService: photoService,
    private profileService: profileService,
    private paymentService: paymentService,
    private relativeService: relativeService,
    private loginService: loginStateService,
    private remarkService: remarkService,
    private backupService: backupService,

    //deleted database

    private delAttachmentService: DelattachmentService,
    private delPaymentService: DelpaymentService,
    private delPhotoService: DelphotoService,
    private delProfileService: DelprofileService,
    private delRelativeService: DelrelativeService,
    private delRemarkService: DelremarkService

  
    

  ) {
    this.close = false;
    this.showBackup = false;
    this.showSlot = false;
    this.showUser = true;
   }

  ngOnInit(): void {

    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    })
    this.notifyNumber()
    this.retrievePhoto();

    this.username = sessionStorage.getItem("username")
    this.role = sessionStorage.getItem("role");
    this.getUser();


  }

  getUser(){
    this.account.findAll().subscribe(array=> {
      this.retrieveData = array


      for (let i = 0; i<this.retrieveData.length; i++){

        const newDate = new Date(this.retrieveData[i].last_Login);
   

        let latest_date = this.datePipe.transform(newDate,'dd/MM/YYYY HH:mm:ss')

        this.retrieveData[i].last_Login = latest_date;
      }
   
      this.list = this.retrieveData.map(item=> {
       
        return{
          id: item.id,
          ...item as Account
        }
      });




      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();
    })
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }

  clear(){
    this.dateFilter = "";
    this.listData.filter = this.dateFilter.toLowerCase();
  }



  onChange(data){

    const date = data;
    const year = date.substring(0,4);
    const month = date.substring(5,7);
    const day = date.substring(8,10);
    const fullDate = day+"-"+month+"-"+year;

    this.listData.filter = data.trim().toLowerCase();
  }

  onFileSelect(event){
    const fileValue = event.target.files[0];
    this.fileInputLabel = fileValue.name;
    this.fileUploadForm.value.uploadedImage = fileValue;

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

  change(file){

    this.link = file.target.files[0];

  }

  onDelete(data){
    console.log(data.id)

    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'

    }).then((result) => {

      this.accountRid = sessionStorage.getItem('rid')

      if (result.value) {
        const date = new Date();
        const notify = {
          rid: this.accountRid,
          title: 'User Account Deleted'+' '+data.username, 
          description: 'User Account with \n name: '+data.username+'\n Account ID: '+data.rid+'\n was deleted !',
          category: 'Deleted user account',
          date: date,
          view: false
        };
  
        this.notification.create(notify).subscribe(resp=> {
          console.log(resp)
        },error=> {
          console.log(error)
        });


        this.account.delete(data.id).subscribe(resp=> {

          Swal.fire(
            'Removed!',
            'Successfully remove user account',
            'success'
          )
          this.getUser();
          this.notifyNumber();
          
          
        },err=> {
          console.log(err)
        });


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'User Account is still in the database.',
          'error'
        )
      }
    });
  }

  onFilterChange(value) {
    switch (value){
      case "All": {
        this.getUser();
        break;
      }

      case "Administrator": {

        this.onChange("Administrator");
        break;

      }

      case "Staff": {
        this.onChange("Staff");
        break;
      }

      case "View-only": {
        this.onChange("View-only");
        break;
      }


    }
  }

  createUser(){
    this.dialog.open(CreateUserComponent, {
      width: "600px",
      height: "90%",
      panelClass: 'edit-modalbox',
    }).afterClosed().subscribe(data=> {
      this.getUser();
    })
  }

  onEdit(data){
    
      this.dialog.open(EditUserComponent, {
        width: "600px",
        height: "90%",
        panelClass: 'edit-modalbox',
        data: {
          dataKey: data
        }
      }).afterClosed().subscribe(data=> {
        this.username = sessionStorage.getItem("username")
        this.role = sessionStorage.getItem("role");
        this.getUser();
      })
    
  }

  editSlot(data) {
    this.dialog.open(EditSlotComponent, {
      width: "600px",
      height: "70%",
      panelClass: 'edit-modalbox',
      data: {
        dataKey: data
      }
    }).afterClosed().subscribe(data=> {
      this.getSlot();
      this.locationRefresh();
    })
  }




  nav1(){
    console.log("1")
    this.buttonColor1 = "#ff3333";
    this.buttonColor2 = "#ffffff";
    this.buttonColor3 = "#ffffff";

    this.color1 = '#ffffff';
    this.color2 = '#000000';
    this.color3 = '#000000';

    this.showBackup = false;
    this.showSlot = false;
    this.showUser = true;

    this.getUser();
  }
  nav2(){
    console.log("2")
    this.buttonColor2 = "#ff3333";
    this.buttonColor1 = "#ffffff";
    this.buttonColor3 = "#ffffff";

    this.color2 = '#ffffff';
    this.color1 = '#000000';
    this.color3 = '#000000';
    this.showBackup = false;
    this.showSlot = true;
    this.showUser = false;

    this.locationRefresh();
    this.getSlot();
  }
  nav3(){
    console.log("3")
    this.buttonColor3 = "#ff3333";
    this.buttonColor2 = "#ffffff";
    this.buttonColor1 = "#ffffff";

    this.color3 = '#ffffff';
    this.color2 = '#000000';
    this.color1 = '#000000';
    this.showBackup = true;
    this.showSlot = false;
    this.showUser = false;
    this.backupURL = environment.backupURL;
  }



  //Start Slot = true ------------------------ LOCATION


  locationRefresh(){
    this.locationService.findAll().subscribe(data=> {
      this.locationArray = data;
      console.log(this.locationArray)

      for (let i = 0; i<this.locationArray.length; i++){

        const newDate = new Date(this.locationArray[i].date_Updated);
        console.log(newDate)

        let latest_date = this.datePipe.transform(newDate,'dd/MM/YYYY HH:mm:ss')

        this.locationArray[i].date_Updated = latest_date;
      }

    },error=> {
      console.log(error)
    })
  }

  addLocation(){

    if (this.locationName == "" || this.locationName == null){
      Swal.fire('Unsucessful','Empty Field, Please fill in the field to add location','error')
      return;
    }
    var location = {
      location: this.locationName,
    };
    var compare = [];

    this.locationService.findByLocation(this.locationName).subscribe(data=> {
      compare = data;

      console.log(compare)

      if (compare.length == 0){
        //notify
        var accountRid = sessionStorage.getItem('rid');
        var date = new Date();
        console.log(this.locationName)

        const notify = {
          rid: accountRid,
          title: 'New Location Added'+' '+this.locationName, 
          description: 'New location added with \n the name: '+this.locationName,
          category: 'New Location Added',
          date: date,
          view: false
        };

        this.notification.create(notify).subscribe(data=> {                     //create notification
          console.log("notification created")
        },error=> {
          console.log(error)
        })


        this.locationService.create(location).subscribe(result=> {
          Swal.fire('Location Added','Succesfully added location','success')
          this.locationName = "";
          this.locationRefresh();
          return;
        }, error=> {
          Swal.fire('Unsucessful','Cannot add location, please check and try again','error')
          return;
        })
      }

      Swal.fire('Unsucessful','Existed Location! please check and try again','error')
      return;
      
    },error=> {
      Swal.fire('Unsucessful','Cannot add Location, please check and try again','error')
      return;
    })
  
  }


  deleteLocation(data){
      const id = data.id;
      const location = data.location;
      console.log(id)
  
      Swal.fire({
        title: 'Are you sure?',
        text: 'This process is irreversible. Deleting the location may cause data loss or damage',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        cancelButtonText: 'No, let me think'
  
      }).then((result) => {
  
        if (result.value){
          this.locationService.delete(id).subscribe(resp=> {

            var slotArray = []
            this.slotService.findByLocation(location).subscribe(data=> {
              slotArray = data;

              if (slotArray.length !== 0){

                for (let i = 0; i<slotArray.length; i++){

                  if (slotArray[i].taken){
                    var profileArray = [];
                    this.profileService.findByRid(slotArray[i].rid).subscribe(data=> {
                      profileArray = data;

                      profileArray[0].slot = null;
                      profileArray[0].slot_Price = null;

                      this.profileService.update(profileArray[0].id,profileArray[0]).subscribe(data=> {
                        console.log(data)
                      })
                    })

                    this.slotService.delete(slotArray[i].id).subscribe(data=> {
                      console.log(data)
                    })

                    
                  } else {
                    this.slotService.delete(slotArray[i].id).subscribe(data=> {
                      console.log(data)
                    })
                  }
                  

                  


                }
              }
            })

         //notify
        var accountRid = sessionStorage.getItem('rid');
        var date = new Date();
        // console.log(data.location)

        const notify = {
          rid: accountRid,
          title: 'Location Deleted:'+' '+ location, 
          description: 'Location with \n the name: '+location+' has been deleted!',
          category: 'Location Removal',
          date: date,
          view: false
        };

        this.notification.create(notify).subscribe(data=> {                     //create notification
          console.log("notification created")
        },error=> {
          console.log(error)
        })
  
            Swal.fire(
              'Removed!',
              'Successfully remove location',
              'success'
            )
            this.nav2();
            
            
          },err=> {
            Swal.fire(
              'Cannot remove location',
              'Please check and try again',
              'error'
            )
          });
  
  
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Location is still in the database.',
            'error'
          )
        }
      });
    }

    editLocation(i){
      this.number = i;
      this.showEdit = true;
   
      
    }

    saveLocation(i){

      var newDate = new Date();

      if (this.newLocation == "" || this.newLocation == null){
        Swal.fire('Unsuccessful','Empty Field, Please fill in the field to add location','error')
        return;
      }
      var location = {
        id: this.locationArray[i].id,
        location: this.newLocation,
        total_Slot: this.locationArray[i].total_Slot,
        date_Updated: newDate
      };
      var compare = [];
      var slotCompare = [];

      this.slotService.findByLocation(this.locationArray[i].location).subscribe(data=> {
        slotCompare = data;

        if (slotCompare.length !== 0){

          for (let i = 0; i< slotCompare.length; i++){
            slotCompare[i].location = this.newLocation;
            
            this.slotService.update(slotCompare[i].id, slotCompare[i]).subscribe(data=> {
              console.log(data);
              this.getSlot();
            }, error=> {
              console.log(error)
            })
          }
        }


      },error=> {
        console.log(error)
      })
  
      this.locationService.findByLocation(this.newLocation).subscribe(data=> {
        compare = data;
  
        console.log(compare)
  
        if (compare.length == 0){
          //notify
          var accountRid = sessionStorage.getItem('rid');
          var date = new Date();
          // console.log(this.locationArray[i].location);
          // console.log(this.newLocation);

          const notify = {
            rid: accountRid,
            title: 'Location Updated:'+' '+this.locationArray[i].location, 
            description: 'Location with \n the name: '+this.locationArray[i].location+' has been changed to the name: '+this.newLocation,
            category: 'Location Update',
            date: date,
            view: false
          };

          this.notification.create(notify).subscribe(data=> {                     //create notification
            console.log("notification created")
          },error=> {
            console.log(error)
          })

          this.locationService.update(this.locationArray[i].id,location).subscribe(result=> {
            Swal.fire('Location Updated','Succesfully Updated the location','success')
            this.locationName = "";
            this.locationRefresh();
            this.showEdit = false;
            this.number = "";
            this.newLocation = "";
            return;
          }, error=> {
            Swal.fire('Unsuccessful','Cannot update the location, please check and try again','error')
            return;
          })
        }
  
        Swal.fire('Unsuccessful','Existed Location! please check and try again','error')
        return;
        
      },error=> {
        Swal.fire('Unsuccessful','Cannot update the Location, please check and try again','error')
        return;
      })
    


    }

    cancelLocation(){
      const date = new Date();
      console.log(date)
      this.showEdit = false;
      this.showEdit = false;
      this.number = "";
      this.newLocation = "";
    }


    // start slot

    getSlot(){
      this.slotService.findAll().subscribe(array=> {
        this.retrieveData = array
     
        this.list = this.retrieveData.map(item=> {
         
          return{
            id: item.id,
            ...item as Slot
          }
        });
  
  
        this.listSlotData = new MatTableDataSource(this.list);
        this.listSlotData.sort = this.sort;
        this.listSlotData.paginator = this.paginator;
        this.changeDetectorRefs.detectChanges();
        this.searchKey = "";
        this.locationField = "All"
      })
    }

    createSlot(){
      this.dialog.open(CreateSlotComponent, {
        width: "600px",
        height: "78%",
        panelClass: 'edit-modalbox',
      }).afterClosed().subscribe(data=> {
        this.getSlot();
        this.locationRefresh();
      })
      
    }
    


    applySlotFilter(){
      this.listSlotData.filter = this.searchKey.trim().toLowerCase();
    }


    showTable(){
      var data = this.locationField;

      if (data == "All"){
        this.getSlot();
        return;
      }

      this.slotService.findByLocation(this.locationField).subscribe(data=> {
        this.retrieveData = data
     
        this.list = this.retrieveData.map(item=> {
         
          return{
            id: item.id,
            ...item as Slot
          }
        });
  
  
        this.listSlotData = new MatTableDataSource(this.list);
        this.listSlotData.sort = this.sort;
        this.listSlotData.paginator = this.paginator;
        this.changeDetectorRefs.detectChanges();
      })

    }

    deleteSlot(data){

      var taken = data.taken;
      var slotRid = data.rid;

      console.log(data)
      Swal.fire({
        title: 'Are you sure?',
        text: 'This process is irreversible. Deleting the location may cause data loss',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, go ahead.',
        cancelButtonText: 'No, let me think'
  
      }).then((result) => {
  
        if (result.value){

          this.slotService.delete(data.id).subscribe(resp=> {
            var location = data.location;
            var slotNumber = data.slot_Number
            //notify
            var accountRid = sessionStorage.getItem('rid');
            var date = new Date();
            // console.log(location);
            // console.log(slotNumber);

            const notify = {
              rid: accountRid,
              title: 'Slot Deleted:'+' '+location, 
              description: 'Slot: '+slotNumber+ ' \n' + 'from the location '+location+' has been deleted! ',
              category: 'Slot Removal',
              date: date,
              view: false
            };

            this.notification.create(notify).subscribe(data=> {                     //create notification
              console.log("notification created")
            },error=> {
              console.log(error)
            })

            this.slotService.findByLocation(data.location).subscribe(data=> {
              this.slotArray = data;
         
              console.log(location)
                this.locationService.findByLocation(location).subscribe(data=> {
                  this.dataArray = data;
    
                  if(this.dataArray.length !==0){
    
                                this.dataArray[0].total_Slot = this.slotArray.length;
                                this.locationService.update(this.dataArray[0].id, this.dataArray[0]).subscribe(resp=> {
                                  
                                  if (taken){

                                    var profileArray = []
                                    this.profileService.findByRid(slotRid).subscribe(data=> {
                                      profileArray = data;
                                      
                                      profileArray[0].slot = null;
                                      profileArray[0].slot_Price = null;

                                      this.profileService.update(profileArray[0].id,profileArray[0]).subscribe(data=> {
                                        console.log(data)
                                      },error=> {
                                        console.log(error)
                                      })
  
  
                                    })

                                  }
                           



                                this.locationRefresh();
                                }, error=> {
                                  console.log(error)
                                })
               
    
                  }
    
                },error=> {
                  console.log(error)
                })
      
  
              
          
            },error=> {
              console.log(error)
            })
  
            

            Swal.fire(
              'Removed!',
              'Successfully remove slot',
              'success'
            )
            this.getSlot();
            this.locationRefresh();
            
          },err=> {
            Swal.fire(
              'Cannot remove slot',
              'Please check and try again',
              'error'
            )
          });
  
  
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire(
            'Cancelled',
            'Slot is still in the database.',
            'error'
          )
        }
      });
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

        this.getUser();

        this.username = sessionStorage.getItem("username")
        this.role = sessionStorage.getItem("role");

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


async runBackup(){

  var backupURL = environment.backupURL;
  var profileArray = [];

  //Profile Backup

  this.profileService.findAll().subscribe(data=> {
    profileArray = data;

    if (profileArray.length !==0){
      
      for (let i =0; i<profileArray.length;i++){

        var url = backupURL+"/api/profiles";
        var IC = profileArray[i].IC_Number;
        console.log(url)

        
        this.http.get(`${url}/IC/${IC}`).subscribe(data=> {
          this.findProfile = data;

          if (this.findProfile.length == 0){

            this.http.post(url,profileArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully Back up Profile data: "+i

            })

          } else {

            this.http.put(`${url}/update/${this.findProfile[0].id}`,profileArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update Profile data: "+i
            })


          }


          if (i==profileArray.length-1){
            this.updateText+="\n"+"Done back up profile data [100%]"
          }

        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })

      
      }
    }
  },erro=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })



  //location
  var locationArray = [];
  this.locationService.findAll().subscribe(data=> {
    locationArray = data;

    if (locationArray.length !== 0){

      for (let i = 0; i<locationArray.length;i++){

        var locationURL = backupURL+"/api/location";
        var location = locationArray[i].location;
        console.log(locationURL+"   "+location)
       

        this.http.get(`${locationURL}/location/${location}`).subscribe(data=> {
          this.locationDataArray = data;

          if (this.locationDataArray.length == 0){
            this.http.post(locationURL,locationArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up Location data: "+i
            })
          } else {


            this.http.put(`${locationURL}/id/${this.locationDataArray[0].id}`,locationArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update Location data: "+i
            })

          }

          if (i==locationArray.length-1){
            this.updateText+="\n"+"Done back up location data [100%]"
          }

        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })

       


      }
    }
  },error=>{
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })


  //payment --------------------------------------------------------

  var paymentArray = [];

  this.paymentService.findAll().subscribe(data=> {
    paymentArray = data;

    if (paymentArray.length !==0){


      for (let i = 0; i<paymentArray.length;i++){

        var paymentURL = backupURL+"/api/payments";
        var paymentID = paymentArray[i].paymentID;
        console.log(paymentURL+"   "+paymentID)
       

        this.http.get(`${paymentURL}/payment/${paymentID}`).subscribe(data=> {
          this.paymentDataArray = data;

          if (this.paymentDataArray.length == 0){
            this.http.post(paymentURL,paymentArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up Payment data: "+i
            })
          } else {


            this.http.put(`${paymentURL}/${this.paymentDataArray[0].id}`,paymentArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update payment data: "+i
            })

          }

          if (i==paymentArray.length-1){
            this.updateText+="\n"+"Done back up payment data [100%]"
          }

        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })




      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })




  //Slot


  var slotArray = [];

  this.slotService.findAll().subscribe(data=> {
    slotArray = data;

    if (slotArray.length !==0){


      for (let i = 0; i<slotArray.length;i++){

        var slotURL = backupURL+"/api/slots";
        var slotNo = slotArray[i].slot_Number;
        console.log(slotURL+"   "+slotNo)
       

        this.http.get(`${slotURL}/slot/${slotNo}`).subscribe(data=> {
          this.slotDataArray = data;

          if (this.slotDataArray.length == 0){
            this.http.post(slotURL,slotArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up slot data: "+i
            })
          } else {


            this.http.put(`${slotURL}/update/${this.slotDataArray[0].id}`,slotArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update slot data: "+i
            })

          }

          
        if (i==slotArray.length-1){
          this.updateText+="\n"+"Done back up slot data [100%]"
        }


        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })


      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })


  //user account



  
  var accountArray = [];

  this.accountService.findAll().subscribe(data=> {
    accountArray = data;

    if (accountArray.length !==0){


      for (let i = 0; i<accountArray.length;i++){

        var accountURL = backupURL+"/api/account";
        var accountRID = accountArray[i].rid;
        console.log(accountURL+"   "+accountRID)
       

        this.http.get(`${accountURL}/rid/${accountRID}`).subscribe(data=> {
          this.accountDataArray = data;

          if (this.accountDataArray.length == 0){
            this.http.post(accountURL,accountArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up account data: "+i
            })
          } else {


            this.http.put(`${accountURL}/id/${this.accountDataArray[0].id}`,accountArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update account data: "+i
            })

          }

          if (i==accountArray.length-1){
            this.updateText+="\n"+"Done back up account data [100%]"
          }

          
        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })


      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })


  //Attachment


  var attachmentArray = [];

  this.attachment.findAll().subscribe(data=> {
    attachmentArray = data;

    if (attachmentArray.length !==0){


      for (let i = 0; i<attachmentArray.length;i++){

        var attachmentURL = backupURL+"/api/attachment";
        var attachmentID = attachmentArray[i].id;
        console.log(attachmentURL+"   "+attachmentID)
       

        this.http.get(`${attachmentURL}/id/${attachmentID}`).subscribe(data=> {
          this.attachmentDataArray = data;

          if (this.attachmentDataArray.length == 0){
            this.http.post(attachmentURL,attachmentArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up attachment data: "+i
            })
          } else {

            console.log(attachmentArray[i])
            this.http.put(`${attachmentURL}/update/${this.attachmentDataArray[0].id}`,attachmentArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update attachment data: "+i
            })

          }

          if (i==attachmentArray.length-1){
            this.updateText+="\n"+"Done back up attachment data [100%]"
          }

        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
        })

      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please check devices and try again','error')
    return;
  })





    //relative


    var relativeArray = [];

    this.relativeService.findAll().subscribe(data=> {
      relativeArray = data;
  
      if (relativeArray.length !==0){
  
  
        for (let i = 0; i<relativeArray.length;i++){
  
          var relativeURL = backupURL+"/api/relative";
          var relativeID = relativeArray[i].IC_Number
          console.log(relativeURL+"   "+relativeID)
         
  
          this.http.get(`${relativeURL}/IC/${relativeID}`).subscribe(data=> {
            this.relativeDataArray = data;
  
            if (this.relativeDataArray.length == 0){
              this.http.post(relativeURL,relativeArray[i]).subscribe(data=> {
                console.log(data);
                this.updateText += "\n"+"Successfully Back up relative data: "+i
              })
            } else {
  
  
              this.http.put(`${relativeURL}/${this.relativeDataArray[0].id}`,relativeArray[i]).subscribe(data=> {
           
                console.log(data);
                this.updateText += "\n"+"Successfully update relative data: "+i
              })
  
            }

            if (i==relativeArray.length-1){
              this.updateText+="\n"+"Done back up relative data [100%]"
            }
  
            
          },error=> {
            Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          })

       
  
        }
  
      }
    },error=> {
      Swal.fire('Cannot connect to the backup database','Please check devices and try again','error')
      return;
    })


    



    
    //loginstate---------------------------------------------------------------


    var loginArray = [];

    this.loginService.findAll().subscribe(data=> {
      loginArray = data;
  
      if (loginArray.length !==0){
  
  
        for (let i = 0; i<loginArray.length;i++){
  
          var loginURL = backupURL+"/api/loginState";
          var loginRID = loginArray[i].rid;
          console.log(loginURL+"   "+loginRID)
         
  
          this.http.get(`${loginURL}/rid/${loginRID}`).subscribe(data=> {
            this.loginStateDataArray = data;
  
            if (this.loginStateDataArray.length == 0){
              this.http.post(loginURL,loginArray[i]).subscribe(data=> {
                console.log(data);
                this.updateText += "\n"+"Successfully Back up login data: "+i
              })
            } else {
  
  
              this.http.put(`${loginURL}/update/${this.loginStateDataArray[0].id}`,loginArray[i]).subscribe(data=> {
           
                console.log(data);
                this.updateText += "\n"+"Successfully update login state data: "+i
              })
  
            }

            if (i==loginArray.length-1){
              this.updateText+="\n"+"Done back up login state data [100%]"
            }
  
            
          },error=>{
            Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          })

         
  
        }
  
      }
    },error=> {
      Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
      return;
    })


        //photo---------------------------------------


        var photoArray = [];

        this.photoService.findAll().subscribe(data=> {
          photoArray = data;
      
          if (photoArray.length !==0){
      
      
            for (let i = 0; i<photoArray.length;i++){
      
              var photoURL = backupURL+"/api/photo";
              var photoRID = photoArray[i].rid;
              console.log(photoURL+"   "+photoRID)
             
      
              this.http.get(`${photoURL}/rid/${photoRID}`).subscribe(data=> {
                this.photoDataArray = data;
      
                if (this.photoDataArray.length == 0){
                  this.http.post(photoURL,photoArray[i]).subscribe(data=> {
                    console.log(data);
                    this.updateText += "\n"+"Successfully Back up photo data: "+i
                  })
                } else {
      
      
                  this.http.put(`${photoURL}/update/${this.photoDataArray[0].id}`,photoArray[i]).subscribe(data=> {
               
                    console.log(data);
                    this.updateText += "\n"+"Successfully update photo data: "+i
                  })
      
                }

                if (i==photoArray.length-1){
                  this.updateText+="\n"+"Done back up photo data [100%]"
                }
      
                
              },error=> {
                Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
                return;
              })

           
      
            }
      
          }
        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })



        //notification--------------------------------------------

        
        var notificationArray = [];

        this.notification.findAll().subscribe(data=> {
          notificationArray = data;
          
      
          if (notificationArray.length !==0){
      
      
            for (let i = 0; i<notificationArray.length;i++){
      
              var notificationURL = backupURL+"/api/notifications";
              var notificationID = notificationArray[i].id;
              console.log(notificationURL+"/"+notificationID)
      
              this.http.get(`${notificationURL}/find/${notificationID}`).subscribe(data=> {
                this.noDataArray = data;
      
                if (this.noDataArray == null || this.noDataArray.length == 0){
                  this.http.post(notificationURL,notificationArray[i]).subscribe(data=> {
                    console.log(data);
                    this.updateText += "\n"+"Successfully Back up notification data: "+i
                  })
                } else {
      
      
                  this.http.put(`${notificationURL}/update/${this.noDataArray.id}`,notificationArray[i]).subscribe(data=> {
               
                    console.log(data);
                    this.updateText += "\n"+"Successfully update notification data: "+i
                  })
      
                }

                
              if (i==notificationArray.length-1){
                this.updateText+="\n"+"Done back up notification data [100%]"
              }
      

              },error=> {
                Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
                return;
              })
      
            }
      
          }
        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })




        //Remark--------------------------------------------


        
         var remarkArray = [];

         this.remarkService.findAll().subscribe(data=> {
           remarkArray = data;
       
           if (remarkArray.length !==0){
       
       
             for (let i = 0; i<remarkArray.length;i++){
       
               var remarkURL = backupURL+"/api/remark";
               var remarkRID = remarkArray[i].rid;

               console.log(remarkURL+"   "+remarkRID)
              
       
               this.http.get(`${remarkURL}/rid/${remarkRID}`).subscribe(data=> {
                 this.remarkDataArray = data;
       
                 if (this.remarkDataArray.length == 0){
                   this.http.post(remarkURL,remarkArray[i]).subscribe(data=> {
                     console.log(data);
                     this.updateText += "\n"+"Successfully Back up remark data: "+i
                   })
                 } else {
       
       
                   this.http.put(`${remarkURL}/id/${this.remarkDataArray[0].id}`,remarkArray[i]).subscribe(data=> {
                
                     console.log(data);
                     this.updateText += "\n"+"Successfully update remark data: "+i
                   })
       
                 }

                          
                 if (i==remarkArray.length-1){
                     this.updateText+="\n"+"Done back up remark data [100%]"
                 }

               },error=> {
                   Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error');
                   return;
               })
       
       
             }
       
           }
         },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
           return;
         })
 


//Deleted database backup -----------------------------------------------------------------------------------------------




  //DelAttachment


  var delattachmentArray = [];

  this.delAttachmentService.findAll().subscribe(data=> {
    delattachmentArray = data;

    if (delattachmentArray.length !==0){


      for (let i = 0; i<delattachmentArray.length;i++){

        var delattachmentURL = backupURL+"/api/delattachment";
        var delattachmentID = delattachmentArray[i].id;
        console.log(delattachmentURL+"   "+delattachmentID)
       

        this.http.get(`${delattachmentURL}/id/${delattachmentID}`).subscribe(data=> {
          this.delattachmentDataArray = data;

          if (this.delattachmentDataArray.length == 0){
            this.http.post(delattachmentURL,delattachmentArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up deleted attachment data: "+i
            })
          } else {


            this.http.put(`${delattachmentURL}/update/${this.delattachmentDataArray[0].id}`,delattachmentArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update deleted attachment data: "+i
            })

          }

          if (i==delattachmentArray.length-1){
            this.updateText+="\n"+"Done back up deleted attachment data [100%]"
          }

        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })

        
     

      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })




  //delPayment -----------------------------------------

  var delpaymentArray = [];

  this.delPaymentService.findAll().subscribe(data=> {
    delpaymentArray = data;

    if (delpaymentArray.length !==0){


      for (let i = 0; i<delpaymentArray.length;i++){

        var delpaymentURL = backupURL+"/api/delpayments";
        var delpaymentID = delpaymentArray[i].paymentID;
        console.log(delpaymentURL+"   "+delpaymentID)
       

        this.http.get(`${delpaymentURL}/payment/${delpaymentID}`).subscribe(data=> {
          this.delpaymentDataArray = data;

          if (this.delpaymentDataArray.length == 0){
            this.http.post(delpaymentURL,delpaymentArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up deleted Payment data: "+i
            })
          } else {


            this.http.put(`${delpaymentURL}/${this.delpaymentDataArray[0].id}`,delpaymentArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update deleted payment data: "+i
            })

          }

                  
        if (i==delpaymentArray.length-1){
          this.updateText+="\n"+"Done back up deleted payment data [100%]"
        }
        
        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })




      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })





  //deleted photo


  var delphotoArray = [];

  this.delPhotoService.findAll().subscribe(data=> {
    delphotoArray = data;

    if (delphotoArray.length !==0){


      for (let i = 0; i<delphotoArray.length;i++){

        var delphotoURL = backupURL+"/api/delphoto";
        var delphotoRID = delphotoArray[i].rid;
        console.log(delphotoURL+"   "+delphotoRID)
       

        this.http.get(`${delphotoURL}/rid/${delphotoRID}`).subscribe(data=> {
          this.delphotoDataArray = data;

          if (this.delphotoDataArray.length == 0){
            this.http.post(delphotoURL,delphotoArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up deleted photo data: "+i
            })
          } else {


            this.http.put(`${delphotoURL}/update/${this.delphotoDataArray[0].id}`,delphotoArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update deleted photo data: "+i
            })

          }

            
        if (i==delphotoArray.length-1){
          this.updateText+="\n"+"Done back up deleted photo data [100%]"
        }


        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error');
          return;
        })


      
      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })


  //deleted profile service

  var delprofileArray = [];

  this.delProfileService.findAll().subscribe(data=> {
    delprofileArray = data;

    if (delprofileArray.length !==0){
      
      for (let i =0; i<delprofileArray.length;i++){

        var delurl = backupURL+"/api/delprofiles";
        var delIC = delprofileArray[i].IC_Number;
        console.log(delurl)

        
        this.http.get(`${delurl}/IC/${delIC}`).subscribe(data=> {
          this.delprofileDataArray = data;

          if (this.delprofileDataArray.length == 0){

            this.http.post(delurl,delprofileArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully Back up deleted Profile data: "+i
            })

          } else {

            this.http.put(`${delurl}/update/${this.delprofileDataArray[0].id}`,delprofileArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update deleted Profile data: "+i
            })


          }

           
        if (i==delprofileArray.length-1){
          this.updateText+="\n"+"Done back up deleted profile data [100%]"
        }

          

        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
          return;
        })

       

      
      }
    }
  },erro=> {
    Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })



  // deleted relative


  var delrelativeArray = [];

  this.delRelativeService.findAll().subscribe(data=> {
    delrelativeArray = data;

    if (delrelativeArray.length !==0){


      for (let i = 0; i<delrelativeArray.length;i++){

        var delrelativeURL = backupURL+"/api/delrelative";
        var delrelativeID = delrelativeArray[i].IC_Number;
        console.log(delrelativeURL+"   "+delrelativeID)
       

        this.http.get(`${delrelativeURL}/IC/${delrelativeID}`).subscribe(data=> {
          this.delrelativeDataArray = data;
          console.log(data)
          if (this.delrelativeDataArray.length == 0){
            this.http.post(delrelativeURL,delrelativeArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up deleted relative data: "+i
            })
          } else {


            this.http.put(`${delrelativeURL}/update/${this.delrelativeDataArray[0].id}`,delrelativeArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update deleted relative data: "+i
            })

          }

          if (i==delrelativeArray.length-1){
            this.updateText+="\n"+"Done back up deleted relative data [100%]"
          }

        },error=> {
          Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
        })



     


      }

    }
  },error=> {
    Swal.fire('Cannot connect to the backup database','Please check devices and try again','error')
    return;
  })

  

  //deleted remark------------


  var delremarkArray = [];

  this.delRemarkService.findAll().subscribe(data=> {
    delremarkArray = data;

    if (delremarkArray.length !==0){


      for (let i = 0; i<delremarkArray.length;i++){

        var delremarkURL = backupURL+"/api/delremark";
        var delremarkRID = delremarkArray[i].rid;

        console.log(delremarkURL+"   "+delremarkRID)
       

        this.http.get(`${delremarkURL}/rid/${delremarkRID}`).subscribe(data=> {
          this.delremarkDataArray = data;

          if (this.delremarkDataArray.length == 0){
            
            this.http.post(delremarkURL,delremarkArray[i]).subscribe(data=> {
              console.log(data);
              this.updateText += "\n"+"Successfully Back up deleted remark data: "+i
            })

          } else {


            this.http.put(`${delremarkURL}/id/${this.delremarkDataArray[0].id}`,delremarkArray[i]).subscribe(data=> {
         
              console.log(data);
              this.updateText += "\n"+"Successfully update deleted remark data: "+i
            })

          }

          if (i==delremarkArray.length-1){
            this.updateText+="\n"+"Done back up deleted remark data [100%]"
          }
          
        },error=> {
            Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error');
            return;
        })

        
     

      }

    }
  },error=> {
   Swal.fire('Cannot connect to the backup database','Please make sure backup server is connected to the same network and try again','error')
    return;
  })

  var name = {
    name:"Backup"
  }
  this.backupService.backup(name).subscribe(data=> {
    this.updateText+="\n"+"Done back up Attachment and ProfilePhoto data [100%]"
  },error=> {
    Swal.fire('Cannot connect to the media database (Attachment)','Please make sure media server is connected to the same network and try again','error');
    return;
  })



  await Swal.fire('This may take a while','Data backup is in progress','info')



























  

}




}
