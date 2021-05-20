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



@Component({
  selector: 'app-vendor-profile',
  templateUrl: './vendor-profile.component.html',
  styleUrls: ['./vendor-profile.component.scss'],
})
export class VendorProfileComponent implements OnInit {

  

  id;
  username: any;
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


  ) {
    const compId = this.route.snapshot.paramMap.get('rid')
    this.id = compId
    this.close = false;

   }

  ngOnInit(): void {
    this.notifyNumber();
    this.refreshData();

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
      this.vendorID = this.id
      this.latestPaymentDate = this.retrieveData[0].latest_Payment_Date
      console.log(this.username)
      console.log(this.retrieveData)

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
    this.color5 = '#919191'

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
    this.color4 = '#919191'
  }




















}



