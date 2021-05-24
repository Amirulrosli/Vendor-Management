import { ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from '../services/Profile.model';
import { profileService } from '../services/profile.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { paymentService } from '../services/payment.service';
import { Payment } from '../services/Payment.model';
import { DatePipe } from '@angular/common';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { notificationService } from '../services/notification.service';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from '../notification/notification.component';
import { VendorDetailsComponent } from '../vendor-details/vendor-details.component';
import Swal from 'sweetalert2';
import { EmailComponent } from '../email/email.component';
import { slotService } from '../services/slot.service';
import { relativeService } from '../services/relative.service';
import { accountService } from '../services/account.service';
import { SideProfileComponent } from '../side-profile/side-profile.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { attachmentService } from '../services/Attachment.service';
import { remarkService } from '../services/remark.service';
import { photoService } from '../services/photo.service';



@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss'],
})
export class VendorProfileComponent implements OnInit {


  id;
  username: any;
  profileName:any;
  profileRole:any;
  slot:any;
  rid: any;
  email:any;
  retrieveData:any;
  paymentHistory:any;
  paymentList: Payment[];
  paymentData: any;
  retrieveDataLength:any;
  list:any[];
  close;
  opened = true
  contract: any;


  nextPayment: any;
  nextDate:any;
  dateToday;
  latestPaymentDate:any;
  today;
  overdueDays;
  overdue;
  finalOverdue;
  nextPay:any;
  vendorIC;
  phoneNo;
  vendorID;
  notifyData: any;
  notifyNo: any;
  price: any;
  searchKey: any;
  dateFilter: any;
  selectFilter: any = "All";
  rent_Date: any;
  color1: any = '#ffffff';
  color2: any;
  color3: any;
  color4: any;
  color5:any;
  buttonColor1: any = '#b366ff';
  buttonColor2:any;
  buttonColor3:any;
  buttonColor4:any;
  buttonColor5:any;
  showPayment: any = true;
  showProfile: any = false;
  showAttachment: any = false;
  showSpouse: any = false;
  showRemarks:any = false;
  address:any;
  location: any;
  slotArray: any = [];
  relativeArray: any = [];
  childArray: any = [];
  spouseArray: any = [];
  accountRole: any;
  isAdmin;
  viewOnly: any;
  editSpouse = false;
  spouseName: any;
  spouseIC: any;
  spouseNumber:any;
  value: any;
  spouseRid: any;
  spouseRelationship: any;
  spouseDataArray: any =[];
  spouseID:any;
  showAddChild: any = false;
  childIC:any;
  childNumber:any;
  childName: any;
  RemarksArray: any = [];
  childDataAttay:any = []
  editChildArray: any = [];
  profileArray: any = [];
  attachmentArray: any = [];
  onEditRemarks = false;
  description: any;
  descriptionRemarks:any;
  

  newChildName:any;
  newChildICNumber:any;
  showEdit = false;
  number: any;
  baseURL: any;
  profilePic: any;
  photoArray: any = []
  profilePhoto: any;
  

  fileUploadForm: FormGroup;
  fileInputLabel: string

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


   displayedColumns: string[] = [
    'payment_Date',
    'due_Date',
    'price',
    'send_Email',
    'email'
  
  ];
  


  

  constructor(
    private router: Router,
    private profiles: profileService,
    private route: ActivatedRoute,
    private payment: paymentService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private slotService: slotService,
    private relativeService: relativeService,
    private accountService: accountService,
    private formBuilder : FormBuilder,
    private attachmentService: attachmentService,
    private remarkService: remarkService,
    private photoService: photoService


  ) {
    const compId = this.route.snapshot.paramMap.get('rid')
    this.id = compId
    this.close = false;

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

   }

  ngOnInit(): void {
    this.notifyNumber();
    this.refreshData();
    this.retrievePhoto();

  

    this.profileName = localStorage.getItem('username');
    this.profileRole = localStorage.getItem('role');

    this.showAddChild = false;
    this.baseURL = this.attachmentService.baseURL();

    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: ['']
    })

  }

  //identify if user is admin
  identifyRole(){
    this.accountRole = localStorage.getItem("role")

    if (this.accountRole == "Administrator") {
      console.log(this.accountRole)
      this.isAdmin = true;
      this.viewOnly = false;
    } 
    
    // else{
    //   this.isAdmin = false;
    // }

    if (this.accountRole == "View-only") {
      this.isAdmin = false;
      this.viewOnly = true;
    }


  }

  retrievePhoto(){
    console.log(this.id)
    this.photoService.findByRid(this.id).subscribe(data=> {
      this.photoArray = data;

      if (this.photoArray.length !== 0){
        var baseURL = this.photoService.baseURL();
        this.profilePhoto = baseURL+"/"+this.photoArray[0].link;
       
      }

    },error=> {
      console.log(error)
    })
  }



  print(){
    if (this.opened == true){
      this.opened = false;
      this.close = true;
      Swal.fire("INFO: Closing The Navigation","Closing the navigation pane provide better print display, Please click the 'Print' icon again to continue","info")
    } else{
      window.print();
    }
  }

  sendEmail(){
    this.dialog.open(EmailComponent, {
      width: "800px",
        height: "90%",
        panelClass:'custom-modalbox',
        data:{
          dataKey: this.retrieveData[0]
        }
    }).afterClosed().subscribe(data=> {
      this.refreshData();
    })
  }

  refreshData(){
    this.payment.findByRid(this.id).subscribe(data => {
      this.paymentHistory = data;
     
 

      this.paymentList = this.paymentHistory.map(item=> {
        return{
          id: item.id,
          ...item as Payment
        }
      });


      console.log(this.paymentList)

      for (let i = 0; i<this.paymentList.length;i++){
        const paymentOldDate = this.paymentList[i].payment_Date;
        const dueOldDate = this.paymentList[i].due_Date;

        let payment = this.datePipe.transform(paymentOldDate,'dd-MM-yyyy')
        let due = this.datePipe.transform(dueOldDate,'dd-MM-yyyy')

        this.paymentList[i].payment_Date = payment;
        this.paymentList[i].due_Date = due;
      }

   

      this.paymentData = new MatTableDataSource(this.paymentList);
      this.paymentData.sort = this.sort;
      this.paymentData.paginator = this.paginator;



    });

    this.retrieveProfile();

  }


  retrieveProfile(){

    this.profiles.findByRid(this.id).subscribe(array=> {
      this.retrieveData = array
      this.username = this.retrieveData[0].name;
      this.slot = this.retrieveData[0].slot
      this.address = this.retrieveData[0].address;
      this.price = this.retrieveData[0].slot_Price;
      this.email = this.retrieveData[0].email
      this.vendorIC = this.retrieveData[0].IC_Number
      this.phoneNo = this.retrieveData[0].phone;
      this.rent_Date = this.retrieveData[0].rent_Date;
      this.rid = this.retrieveData[0].rid;
      this.contract = this.retrieveData[0].contract;

      if (this.contract){
        this.contract="Contract"
      } else {
        this.contract = "Non-Contract";
      }
      this.vendorID = this.id
      this.latestPaymentDate = this.retrieveData[0].latest_Payment_Date
  

      this.retrieveSlot(this.slot)

      //overdue days
      this.nextDate = this.retrieveData[0].latest_Due_Date
      this.nextPayment = this.datePipe.transform(this.nextDate,'MM/dd/yyyy') 
      this.nextPay = this.datePipe.transform(this.nextPayment, 'dd LLLL yyyy')

      this.dateToday = new Date()
      this.today = this.datePipe.transform(this.dateToday,'MM/dd/yyyy')

      if (this.nextPayment !== null){
        var parsedNextDate = parseDate(this.nextPayment)
        var parsedToday = parseDate(this.today)
  
        console.log("today: "+ parsedToday)
        console.log("latest Payment Date: " + parsedNextDate)
  
        var overdueTime = parsedToday.getTime() - parsedNextDate.getTime(); 
        this.overdueDays = overdueTime / (1000 * 3600 * 24);
        this.overdue = this.overdueDays
  
        console.log(this.overdueDays)
  
        var noOverdue = this.overdueDays - this.overdue
        this.finalOverdue = this.overdue
        
  
        if(this.overdueDays < 0){
          this.finalOverdue = noOverdue;
          console.log(this.finalOverdue);
        }
      } else {
        this.finalOverdue = 0;
        this.nextPay = "N/A"
      }
     

      //parse to date
      function parseDate(str) {
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
    }

    })

  }

  retrieveSlot(slot){
    this.slotService.findBySlot(slot).subscribe(data=> {
        this.slotArray = data;
        console.log(this.slotArray)
        this.location = this.slotArray[0].location;

    },error=> {
      console.log(error)
    })
  }

  addPayment(){
    this.router.navigate(['/add-payment'])
  }

  onEdit(){

    this.dialog.open(EditProfileComponent, {
      width: "800px",
      height: "90%",
      panelClass:'custom-modalbox',
      data: {

        dataKey: this.retrieveData[0]
      }
    }).afterClosed().subscribe(result=> {
      this.refreshData();
      this.retrievePhoto();
  
    });

  }

  viewDetails(){
    this.dialog.open(VendorDetailsComponent, {
      width: "800px",
      height: "90%",
      panelClass:'custom-modalbox',
      data: {

        dataKey: this.retrieveData[0]
      }
    }).afterClosed().subscribe(result=> {
      this.refreshData();
    });
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

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    })
  }


  applyFilter(){
    this.paymentData.filter = this.searchKey.trim().toLowerCase();
  }

  onChange(data){
    console.log(data)
    const date = data;
    const year = date.substring(0,4);
    const month = date.substring(5,7);
    const day = date.substring(8,10);
    const fullDate = day+"-"+month+"-"+year;
    console.log(fullDate)
    this.paymentData.filter = fullDate.trim().toLowerCase();
  }

  clear(){
    this.dateFilter = "";
    this.paymentData.filter = this.dateFilter.toLowerCase();
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
    this.relativeArray = [];
    this.retrieveRelative();
  }

  retrieveRelative(){

    this.childArray = [];
    this.spouseArray =[];

    this.relativeService.findByrid(this.rid).subscribe(data=> {
      this.relativeArray = data;
      console.log(this.relativeArray)

      for (let i = 0; i<this.relativeArray.length; i++){
        if (this.relativeArray[i].relationship == "spouse") {

          this.spouseArray.push(this.relativeArray[i])

          this.spouseName = this.spouseArray[i].name;
          this.spouseIC = this.spouseArray[i].IC_Number.substring(0,2);
          this.spouseNumber = this.spouseArray[i].IC_Number.substring(3,9);
          this.spouseRid = this.spouseArray[i].rid;
          this.spouseRelationship = this.spouseArray[i].relationship;
          this.spouseID = this.spouseArray[i].id;

        } else {

          this.childArray.push(this.relativeArray[i])
        }


      }

      console.log(this.spouseArray)
      console.log(this.childArray)
    }, error=> {
      console.log(error)
    })

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


  onEditSpouse(){
    this.editSpouse = true;
  }

  cancelSpouse(){
    this.editSpouse = false;
  }

  submitSpouse(){

    const Number = this.spouseNumber;
    const IC = this.spouseIC;
    const name = this.spouseName;
    const IC_Number = IC+"-"+Number;
    const relationship = this.spouseRelationship;
    const myrid = this.spouseRid;

    console.log(myrid)

    var exp = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (name !== "" && IC !== "" && Number !== "") {
      if (exp.test(Number) && Number.length ==  6){

        var spouse =  {
          rid: myrid,
          name: name,
          IC_Number: IC_Number,
          relationship: relationship
        }

        this.relativeService.findByIC(IC_Number).subscribe(data=> {
          this.spouseDataArray = data;
          console.log(this.spouseDataArray.length)
          

          if(this.spouseDataArray.length == 0) {
           
            this.relativeService.update(this.spouseID,spouse).subscribe(data=> {
             
              Swal.fire("Spouse Updated","Successfully update spouse",'success')
              this.retrieveRelative();
              this.editSpouse = false;
              return;
            


            },error=> {
              Swal.fire('Please Try Again',"Cannot update spouse details",'error')
             return;
            })
          } else{

            console.log(this.spouseArray[0].IC_Number)
            console.log(this.spouseDataArray[0].IC_Number)
            var findIC_Number = this.spouseDataArray[0].IC_Number;
            var retrieveIC_Number = this.spouseArray[0].IC_Number;

            if (findIC_Number == retrieveIC_Number){
            
              this.relativeService.update(this.spouseID,spouse).subscribe(data=> {
                
                Swal.fire("Spouse Updated","Successfully update spouse",'success')
                this.retrieveRelative();
                this.editSpouse = false;
                return;
               
                
              },error=> {
                Swal.fire('Please Try Again',"Cannot update spouse details",'error')
               return;
              })
            } else {
              Swal.fire('Please Try Again',"IC Number already Existed in the Database",'error')
             return;
            }
           
          } 
        })

      } else {
        Swal.fire('Please Try Again',"Incorrect IC Number format",'error')
        return;
      }
    } else {

      Swal.fire('Please Try Again',"Cannot Leave the field Blank",'error')
      return;
    }
   


  }

  showChild(){
    this.showAddChild = true;
    this.childName = "";
    this.childIC = "";
    this.childNumber = "";
  }

  cancelChild(){
    this.showAddChild = false;
  }

  submitChild(){

    const name = this.childName;
    const IC = this.childIC;
    const Number = this.childNumber;
    const rid = this.id;
    const relationship = "child";
    const IC_Number = IC+"-"+Number;
    

    var exp = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (name !== "" && IC !== "" && Number !== ""){

      if(exp.test(Number) && Number.length == 6){


        var child = {
          name: name,
          IC_Number: IC_Number,
          rid: rid,
          relationship:relationship
        }

        this.relativeService.findByIC(IC_Number).subscribe(data=> {
          this.childDataAttay = data;

          if (this.childDataAttay.length == 0){
            this.relativeService.createRelative(child).subscribe(data=> {
              Swal.fire('Child Added','successfully add child','success');
              this.retrieveRelative();
              this.showAddChild = false;
              return;
            },error=> {
              Swal.fire('Please Try Again',"Cannot update child details",'error')
              return;
            })
          } else {

            Swal.fire('Please Try Again',"Cannot add child, Child with same data is already existed in the database",'error')
              return;


          }
        },error=> {
          Swal.fire('Please Try Again',"Cannot update spouse details",'error')
          return;
        })


      } else {
        Swal.fire('Please Try Again',"Incorrect IC Number format",'error')
        return;
      }

    } else {
      
      Swal.fire('Please Try Again',"Cannot Leave the field empty",'error')
      return;
    }
    

  }



  onDeleteChild(id){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible. Deleting the location may cause data loss',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'

    }).then((result) => {

      if (result.value){

        this.relativeService.delete(id).subscribe(result=> {

          Swal.fire(
            'Success',
            'Successfully delete child detail',
            'success'
          )

          this.retrieveRelative()

          return;


        },error=> {
          Swal.fire(
            'Process Failed',
            'Child is still in the database.',
            'error'
          )
          return;
        })


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Child is still in the database.',
          'error'
        )
        return;
      }
    });
  }

  onEditChild(data,i){
    this.number = i;
    this.showEdit = true;
    this.newChildICNumber = data.IC_Number;
    this.newChildName = data.name;
  }

  cancelSaveChild(){
    this.showEdit = false;
    this.newChildName = "";
    this.newChildICNumber = "";
  }

  saveChild(data,i){

    const name = this.newChildName;
    const IC_Number = this.newChildICNumber;
    const IC = this.newChildICNumber.substring(0,2);
    var lengthNo = this.newChildICNumber.length;
    console.log(lengthNo)
    const Number = this.newChildICNumber.substring(3,lengthNo);
    const relationship = "child";
    const compareIC = data.IC_Number;
    const compareID = data.id;
    console.log(data.IC_Number)
    console.log(Number)

    var exp = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");

    if (name !=="" && IC_Number !== ""){

      if (exp.test(Number) && Number.length == 6){

        var child= {
      
          rid: this.id,
          name: name,
          IC_Number: IC_Number,
          relationship: relationship

        }

        this.relativeService.findByIC(IC_Number).subscribe(data=> {
          this.editChildArray = data;


          if (this.editChildArray == 0){

            this.relativeService.update(compareID,child).subscribe(data=> {
              Swal.fire('Success','successfully updated child details','success')
              this.retrieveRelative();
              this.showEdit = false;
              this.newChildICNumber = "";
              this.newChildName = ""
              return;
            }, error=> {

              Swal.fire("Process Failed","Relative is still in the database","error")
              return;
            })
          } else {
            if (compareIC == this.editChildArray[0].IC_Number){

              this.relativeService.update(compareID,child).subscribe(data=> {
                Swal.fire('Success','successfully updated child details','success')
                this.retrieveRelative();
                this.showEdit = false;
                this.newChildICNumber = "";
                this.newChildName = ""
                return;
              }, error=> {
  
                Swal.fire("Process Failed","Relative is still in the database","error")
                return;
              })

            } else {

              
              Swal.fire("Duplicate error","Child details is already existed in the database, Please Try Again","error")
              return;

            }
          }
        })


      } else {
        Swal.fire('Please Try Again',"Incorrect IC Number format",'error')
        return;
      }


    } else {

      Swal.fire(
        'PLease try again',
        'Cannot leave the field empty',
        'error'
      )
      return;
    }
  

    

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


retrieveID(profileName){
  console.log(profileName)
  this.accountService.findByUsername(profileName).subscribe(data=> {
    this.profileArray = data;
    console.log(this.profileArray)
    const id = this.profileArray[0].id;
    this.openSideProfile(this.profileArray[0]);
})

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
    var accountRID = localStorage.getItem('rid')
    const formData = new FormData()
    formData.append('image',this.fileUploadForm.value.uploadedImage);
    formData.append('vendor_rid',this.rid)
    formData.append('rid',this.rid)
    formData.append('account_rid',accountRID);

    this.attachmentService.uploadFile(formData).subscribe(response => {
      console.log(response);
      if (response.statusCode === 200) {
        this.fileInputLabel = undefined;
      }

      Swal.fire("Success","Image has successfully uploaded",'success')
      this.fileUploadForm.reset();
      this.retrieveAttachment();
    }, er => {
      console.log(er);
      Swal.fire("Upload Failed",'Please Try Again','error');
      return;
    });
  }
}

retrieveAttachment(){
  this.attachmentService.findByVendorid(this.rid).subscribe(data=> {
    this.attachmentArray = data;
   
    if (this.attachmentArray.length !== 0){
      var Link = "";
      for(let i = 0; i<this.attachmentArray.length; i++){
        Link = this.baseURL+"/"+this.attachmentArray[i].link;
        this.attachmentArray[i].link = Link;
      }
    }
  },error=> {
    console.log(error)
  })
}

deleteAttachment(data){

  var imageID = data.id;

  Swal.fire({
    title: 'Are you sure?',
    text: 'This process is irreversible. Deleting the image may cause data loss',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, go ahead.',
    cancelButtonText: 'No, let me think'

  }).then((result) => {

    if (result.value){

      this.attachmentService.delete(imageID).subscribe(result=> {

        Swal.fire(
          'Success',
          'Successfully delete the selected image',
          'success'
        )

        this.retrieveAttachment()

        return;


      },error=> {
        Swal.fire(
          'Cannot delete image',
          'Attachment is still in the database.',
          'error'
        )
        return;
      })


    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelled',
        'Attachment is still in the database.',
        'error'
      )
      return;
    }
  });

}

cancelAttachment(){
  this.fileUploadForm.reset();
  this.retrieveAttachment();
}

retrieveRemarks(){


  this.remarkService.findByRid(this.id).subscribe(data=> {
    this.RemarksArray = data;
    this.descriptionRemarks = this.RemarksArray[0].Description;
    this.description = this.RemarksArray[0].Description;
    console.log(this.descriptionRemarks)
    console.log(this.RemarksArray.length)
    
  }, error=> {
    console.log(error)
  })

}

showEditRemarks(){
  this.onEditRemarks = true;
}

cancelRemarks(){
  this.onEditRemarks = false;
  this.retrieveRemarks();
}

submitRemarks(){

  const description = this.description;
  const account_rid = localStorage.getItem('rid');
  const rid = this.id;

  this.retrieveRemarks();



  if(this.RemarksArray.length==0){

    var remarks = {
      rid: rid,
      account_rid: account_rid,
      Description: description,
    }

    this.remarkService.create(remarks).subscribe(data=> {

      Swal.fire("Success","Successfully created remarks",'success')
      this.onEditRemarks = false;
      this.retrieveRemarks()
      return;

    },error=> {
      Swal.fire("Failed","Cannot create remarks",'error')
      return;
    });
  } else {

    var remarks1 = {
      id: this.RemarksArray[0].id,
      rid: rid,
      account_rid: account_rid,
      Description: description,
    }

    this.remarkService.update(this.RemarksArray[0].id, remarks1).subscribe(data=> {
      Swal.fire("Success","Successfully updated remarks",'success')
      this.onEditRemarks = false;
      this.retrieveRemarks()
      return;
    },error=> {
      Swal.fire("Failed","Cannot update remarks",'error')
      return;
    });

  }

}




















}



