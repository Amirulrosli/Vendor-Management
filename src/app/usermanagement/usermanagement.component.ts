
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
import Swal from 'sweetalert2';
import { CreateSlotComponent } from '../create-slot/create-slot.component';
import { CreateUserComponent } from '../create-user/create-user.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { NotificationComponent } from '../notification/notification.component';
import { Account } from '../services/account.model';
import { accountService } from '../services/account.service';
import { attachmentService } from '../services/Attachment.service';
import { locationService } from '../services/location.service';
import { notificationService } from '../services/notification.service';
import { photoService } from '../services/photo.service';
import { Slot } from '../services/slot.model';
import { slotService } from '../services/slot.service';
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
  link: any;
  username: any;
  role: string;
  action = "http://localhost:3000/upload-Profile";
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dateFilter: any;
  selectField: any = "All"

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
  profilePhoto:any;
  profileID: any;

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
    private photoService: photoService

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

    this.username = localStorage.getItem("username")
    this.role = localStorage.getItem("role");
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

      if (result.value) {
        const date = new Date();
        const notify = {
          rid: data.rid,
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
        this.getUser();
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


  deleteLocation(id){

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
  
            Swal.fire(
              'Removed!',
              'Successfully remove location',
              'success'
            )
            this.locationRefresh();
            
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
            'User Account is still in the database.',
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
          this.locationService.update(this.locationArray[i].id,location).subscribe(result=> {
            Swal.fire('Location Updated','Succesfully Update the location','success')
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

            this.slotService.findByLocation(data.location).subscribe(data=> {
              this.slotArray = data;
         
              console.log(location)
                this.locationService.findByLocation(location).subscribe(data=> {
                  this.dataArray = data;
    
                  if(this.dataArray.length !==0){
    
                                this.dataArray[0].total_Slot = this.slotArray.length;
                                this.locationService.update(this.dataArray[0].id, this.dataArray[0]).subscribe(resp=> {
                                console.log(resp)
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




}
