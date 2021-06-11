import { isEmptyExpression } from '@angular/compiler';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { NotificationComponent } from '../notification/notification.component';
import { SideProfileComponent } from "../side-profile/side-profile.component";
import { Profile } from '../services/Profile.model';
import { profileService } from '../services/profile.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { notificationService } from '../services/notification.service';
import { ChangeDetectorRef } from '@angular/core';
import { slotService } from '../services/slot.service';
import { paymentService } from '../services/payment.service';
import { EmailComponent } from '../email/email.component';

import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ChartComponent,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexTheme,
  ApexLegend
} from "ng-apexcharts";
import { accountService } from '../services/account.service';
import { loginStateService } from '../services/loginState.service';
import { OnlineModel } from '../services/online.model';
import { photoService } from '../services/photo.service';
import { Slot } from '../services/slot.model';
import { locationService } from '../services/location.service';
import { relativeService } from '../services/relative.service';
import { attachmentService } from '../services/Attachment.service';
import { remarkService } from '../services/remark.service';
import { DelphotoService } from '../servicesDeleted/photo.service';
import { DelpaymentService } from '../servicesDeleted/payment.service';
import { DelprofileService } from '../servicesDeleted/profile.service';
import { DelattachmentService } from '../servicesDeleted/Attachment.service';
import { DelrelativeService } from '../servicesDeleted/relative.service';
import { DelremarkService } from '../servicesDeleted/remark.service';
import { environment } from 'src/environments/environment';
import { EditPaymentComponent } from '../edit-payment/edit-payment.component';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string [];
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  theme: ApexTheme
  legend: ApexLegend;

  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  series1: ApexAxisChartSeries;
  fill: ApexFill
};



@Component({
  selector: 'app-dahsboard',
  templateUrl: './dahsboard.component.html',
  styleUrls: ['./dahsboard.component.scss']
})

export class DahsboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("piechart") piechart: ChartComponent;
  public piechartOptions: Partial<ChartOptions>;

  @ViewChild("linechart") linechart: ChartComponent;
  public linechartOptions: Partial<ChartOptions>;

  @ViewChild("linechart1") linechart1: ChartComponent;
  public linechartOptions1: Partial<ChartOptions>;

  totalPayment1: any;
  paymentSeries1: any;
  
  close: any;
  opened = true
  retrieveData:any;
  retrieveDataLength:any;
  list:Profile[];
  listLogin: OnlineModel[];
  searchKey: any;
  notifyNo: any;
  notifyData:any;
  overDueData: any;
  paidData: any;
  overdueLength: any;
  overdue:any;
  dateToday;
  today;
  paymentDue;
  overdueDays;
  overdueBoolean: boolean;
  dueTrue: true;
  selectField: string = "All";
  searchForField: string = "Vendor";
  selectSlotField: string = "All";
  showSlotField = false;
  paymentArray1:any=[]



  slotData: any;
  slotLength: any;
  slotRid: any = []
  paymentRid: any = []
  paymentData: any = [];
  paidLength: any;
  username: any;
  role: any;
  profileArray: any =[]
  isAdmin;
  accountRole: any;
  viewOnly: any;
  takenSlot: any = [];
  availableSlot:any = [];
  chartNumber: any;
  showPieChart = false;
  paymentArray: any = [];
  loginStateArray: any = [];
  loginProfile: any = [];
  photoArray: any = [];
  profilePhoto:any;
  profileID: any;
  picArray:any;
  profilePic: any
  switchAllSlot: any = []
  viewNotification: any = [];
  listNotify: any = [];
  date: Date;
  accountRid: string;
  listNotifyArray: any = [];
  
  takenSlotArray: any = [];
  availableSlotArray: any = [];
  locationField = "All";
  locationArray: any = [];
  paymentTableArray: any = []
  paymentNewArray: any = [];
  spouseArray: any = [];
  spouseField = "All";

  showPayment = false;
  showRelative = false;
  showVendor = true;
  notificationField = "All";
  dateFilter: any;
  endFilter: any;
  filteredArray: any = [];
  discontinued: any = [];
  discontinuedlength: any;
  delPaymentArray: any = [];
  totalPayment = 0;
  paymentSeries: any =[];
  footer: any = "";
  before: any;
  after: any;
  rangeDataArray: any;




  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  listData: MatTableDataSource<any>;
  listDataPrint: MatTableDataSource<any>;
  loginData: MatTableDataSource<any>;


  displayedColumns: string[] = [
  
    'IC_Number',
    'name',
    'email',
    'phone',
    'latest_Payment',
    'slot',
    'overdue',
    'actions'
    
  
  ];

  displayedLoginColumns: string [] = [
    'profilePic',
    'id',
    'username',
    'state',
    'last_Login',
   
  ]
displayedLocationColumns: string[] = [
    "location",
    "slot_Number",
    "slot_Price",
    "taken",
    "name",
    "overdue",
    "actions",
  ]

  displayedPaymentsColumns: string[] = [
    "Receipt ID",
    "slot_Number",
    'Price',
    "payment_Date",
    "due_Date",
    "send_Email",
    "name",
    "email",
    "actions"
  ]

  displayedRelativeColumns: string [] = [
    "IC_Number",
    "name",
    "relationship",
    "vendorName",
    "Updated_At",
    "actions"

  ]

  
  constructor(
    private router: Router,
    private profiles: profileService,
    private dialog: MatDialog,
    private slidePanel: MatSlidePanel,
    private datePipe: DatePipe,
    private notification: notificationService,
    private changeDetectorRefs: ChangeDetectorRef,
    private slot: slotService,
    private paymentService: paymentService,
    private accountService: accountService,
    private loginStateService: loginStateService,
    private photoService: photoService,
    private locationService: locationService,
    private relativeService: relativeService,
    private attachmentService: attachmentService,
    private remarkService: remarkService,



    //Service for deleted records

    private delPhotoService: DelphotoService,
    private delPaymentService: DelpaymentService,
    private delProfileService: DelprofileService,
    private delAttachmentService: DelattachmentService,
    private delRelativeService: DelrelativeService,
    private delRemarkService: DelremarkService
  ) { 

    this.close = false;
  }



  ngOnInit(): void {

    this.showVendor = true;
    this.notificationField = "All";
    this.spouseField = "All"
    this.showRelative = false;
    this.showSlotField = false;
    this.showPayment = false;


   this.retrievePhoto()
    this.showPieChart = false;

    this.notifyNumber();
    this.refreshData();
    
    this.retrieveSlot();
    this.paid();
    this.identifyRole();
    this.overDue();
    this.conf();
    
    this.createChart();
    this.createPieChart();
    this.createLineChart();
    this.createLineChart1()
    this.findOnlineUser();
    this.getLocation();



  }

  goToReceipt(element){
    (element)
    this.router.navigate(['/receipt/'+element.paymentID])
  }

  getLocation(){
    this.locationService.findAll().subscribe(data=> {
      this.locationArray = data;
    },error=> {
      //(this.locationArray)
    })
  }

  goToReport(){
    this.router.navigate(['/report'])
  }

  //identify if user is admin
  identifyRole(){
    this.accountRole = sessionStorage.getItem("role")

    if (this.accountRole == "Administrator") {
      //(this.accountRole)
      this.isAdmin = true;
    } else{
      this.isAdmin = false;
    }

    if (this.accountRole == "View-only") {
      this.isAdmin = false;
      this.viewOnly = true;
    }


  }

  //TABLE SECTION -- Online User

  findOnlineUser(){


    this.loginStateService.findOnline().subscribe(data=> {
        this.loginStateArray = data;

        if(this.loginStateArray.length !== 0){

          for (let i = 0; i<this.loginStateArray.length;i++){
            var state = this.loginStateArray[i].login_state;
            this.accountService.findByRid(this.loginStateArray[i].rid).subscribe(data=> {
              this.loginProfile = data;
              var id = i+1;
              this.loginStateArray[i].username =  this.loginProfile[0].username;
              var newDate = new Date(this.loginProfile[0].last_Login);
              let latestDate = this.datePipe.transform(newDate,'dd/MM/YY HH:mm')
              this.loginStateArray[i].last_Login = latestDate;


              this.photoService.findByRid(this.loginStateArray[i].rid).subscribe(data=> {
                this.picArray = data;

                if (this.picArray.length !== 0){
                  var baseURL = this.photoService.baseURL();
                this.loginStateArray[i].profilePic = baseURL+"/"+this.picArray[0].link;
                }
                
              })

            })

          }

         this.refreshOnline();




        }
    },error=> {
      //(error)
    })

  }

  refreshOnline(){
    //(this.loginStateArray)
    this.loginData = new MatTableDataSource(this.loginStateArray);
    this.loginData.sort = this.sort;
    this.loginData.paginator = this.paginator;
    this.changeDetectorRefs.detectChanges();

  }

  //TABLE SECTION --- VENDOR PROFILE

  retrieveSlot(){
    this.slot.findAll().subscribe(data=> {
      this.slotData = data;
      this.slotLength = this.slotData.length;
    })
  }

  parseDate(str){
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
  }

  goToDashboard(){
    this.router.navigate(["/dashboard"]);
  }

  openNav(){
    this.close = false;
  }

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    }).afterDismissed().subscribe(data=> {
      this.notifyNumber();
    })
  }

  closeNav(){
    this.close = true;
  }

  applyFilter(){
    this.listData.filter = this.searchKey.trim().toLowerCase();
    this.listDataPrint.filter = this.searchKey.trime().toLowerCase();
  }

  onDelete(data){
  
    var rid = sessionStorage.getItem('rid');
    Swal.fire({
      title: 'Are you sure?',
      text: 'This process is irreversible. Vendor Profile Will be mark as discontinued/deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, go ahead.',
      cancelButtonText: 'No, let me think'

    }).then((result) => {

      if (result.value) {
        const date = new Date();
        const notify = {
          rid: rid,
          title: 'Account Deleted'+' '+data.name, 
          description: 'Vendor profile with \n name: '+data.name+'\n Account ID: '+data.rid+'\n was deleted !',
          category: 'Deleted vendor profile',
          date: date,
          view: false
        };
  
        this.notification.create(notify).subscribe(resp=> {
          
        },error=> {
          //(error)
        });


        var profile = []
        this.profiles.findByRid(data.rid).subscribe(data=> {
          profile = data;

          if(profile.length !==0){
            profile[0].slot = null;
            profile[0].slot_Price = null;
            this.delProfileService.create(profile[0]).subscribe(data=> {
              //(data)
            },error=> {
              //(error)
            })
          }

        })


        //Deleting Payment Service --------------------------------------------------------------------

        this.paymentService.findByRid(data.rid).subscribe(resp=> {
          this.paymentRid = resp;
        

          if (this.paymentRid.length > 0){
            for (let i = 0; i < this.paymentRid.length; i++){
              this.delPaymentService.create(this.paymentRid[i]).subscribe(data=> {
                //(data)

                this.paymentService.delete(this.paymentRid[i].id).subscribe(data=> {
                  //(data);
                }, error=> {
                  //(error)
                })

              },error=> {
                //(error)
              })
             
            }
          }
        }, err=> {
          //(err)
        })


        //Updating Slot Service------------------------------------------------------------

        this.slot.findByRid(data.rid).subscribe(resp=> {  
          this.slotRid = resp;

          if (this.slotRid.length !== 0){

            this.slotRid[0].rid = null;      
            this.slotRid[0].taken = false;      
              this.slot.update(this.slotRid[0].id,this.slotRid[0]).subscribe(data=> {
                //(data);
              },error=> {
                //(error)
              })
            
          }
        },error=> {
          //(error)
        })


        //Deleting Payment Service -----------------------------------------------------------------------------

        var relative = [];
        this.relativeService.findByrid(data.rid).subscribe(data=> {
          relative = data;

          if (relative.length !== 0){

            for (let i = 0; i<relative.length; i++){
              this.delRelativeService.createRelative(relative[i]).subscribe(data=> {
                //(data)
                this.relativeService.delete(relative[i].id).subscribe(data=> {
                  //(data)
                },error=> {
                  //(error)
                })

              },error=> {
                //(error)
              })
          
            }
          }
        })

        //Deleting Attachment Service ---------------------------------------------------------------------------

        var attachments = [];

        this.attachmentService.findByVendorid(data.rid).subscribe(data=> {
          attachments = data;

          if (attachments.length !== 0){
            for (let i =0; i<attachments.length;i++){
              this.delAttachmentService.create(attachments[i]).subscribe(data=> {
                //(data)

                this.attachmentService.delete(attachments[i].id).subscribe(data=> {
                  //(data);
                },error=> {
                  //(error)
                })


              },error=> {
                //(error)
              })
          
            }
          }
        })


        //Deleting Remark Service ---------------------------------------------------------------------------------

        var remark = []
        this.remarkService.findByRid(data.rid).subscribe(data=> {
          remark = data;

          if (remark.length !== 0){

            this.delRemarkService.create(remark[0]).subscribe(data=> {
              //(data)

              this.remarkService.delete(remark[0].id).subscribe(data=> {
                //(data)
              }, error=> {
                //(error)
              })


            },error=> {
              //(error)
            })
          
          }
        })


        //Deleting Photo Service ----------------------------------------------------------------------------------

        var photo = []
        this.photoService.findByRid(data.rid).subscribe(data=> {
          photo = data;

          if (photo.length !== 0){
            this.delPhotoService.create(photo[0]).subscribe(data=> {
              //(data);

              this.photoService.delete(photo[0].id).subscribe(data=> {
                //(data)
              }, error=> {
                //(error)
              })

            },error=> {
              //(error)
            })
        
          }
        })



        //Deleting profile Service ---------------------------------------------------------------------------------
     
      

        this.profiles.delete(data.id).subscribe(resp=> {

          Swal.fire(
            'Removed!',
            'Vendor Profile removed successfully.',
            'success'
          )
          this.refreshData();
          this.overDue();
          this.retrieveSlot();
          this.notifyNumber();
          this.paid();
          this.createChart();
          this.createPieChart();
          this.createLineChart();
          this.createLineChart1();
          
        },err=> {
          Swal.fire("Cannot Delete Profile","Please Check and Try Again!","error")
        });


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Vendor Profile is still in our database.',
          'error'
        )
      }
    });

  }

  viewing(id){
    this.router.navigate(["vendor-profile/"+id])
  }

  onEdit(data){

    this.profiles.findOne(data.id).subscribe(resp=> {
      //(resp)

      this.dialog.open(EditProfileComponent, {
        width: "800px",
        height: "90%",
        panelClass:'custom-modalbox',
        data: {
  
          dataKey: resp
        }
      }).afterClosed().subscribe(result => {
        this.refreshData();
        this.overDue();
        this.retrieveSlot();
        this.paid();
        this.createLineChart();
        this.createLineChart1();
        this.createChart();
        this.createPieChart();
      });
    }, error=> {
      //(error)
    });

    

  }

  onEmail(data){
    this.dialog.open(EmailComponent, {
      width: "800px",
        height: "90%",
        panelClass:'custom-modalbox',
        data:{
          dataKey: data
        }
    }).afterClosed().subscribe(data=> {
      this.refreshData();
        this.overDue();
        this.retrieveSlot();
        this.paid();
        this.createLineChart();
        this.createLineChart1();
        this.createChart();
        this.createPieChart();
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


  conf(){
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


  refreshData(){
    this.showVendor = true;
    this.showRelative = false;
    this.showSlotField = false;
    this.showPayment = false;
    this.searchForField = "Vendor";
    this.selectSlotField = "All"
    this.selectField = "All"
    this.profiles.findAll().subscribe(array=> {
      this.retrieveData = array
      this.retrieveDataLength = this.retrieveData.length;
   
      this.list = array.map(item=> {
       
        return{
          id: item.id,
          ...item as Profile
        }
      });

      this.loopData();

      //(this.list)

      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.list);
      this.listDataPrint.sort = this.sort;

      this.changeDetectorRefs.detectChanges();

    })

    this.username = sessionStorage.getItem("username");
    this.role = sessionStorage.getItem("role")
    this.searchKey = "";



  }

  loopData(){

    this.dateToday = new Date()
    this.today = this.datePipe.transform(this.dateToday,'MM/dd/yyyy')
    
    
    for (let i = 0; i<this.list.length;i++){
      const paymentOldDate = this.list[i].latest_Payment_Date;
      const paymentDueDate = this.list[i].latest_Due_Date;
      // const dueOldDate = this.paymentList[i].due_Date;

      let payment = this.datePipe.transform(paymentOldDate,'dd-MM-yyyy')
      // let due = this.datePipe.transform(paymentDueDate,'dd-MM-yyyy')
      // let due = this.datePipe.transform(dueOldDate,'dd-MM-yyyy')

      this.list[i].latest_Payment_Date = payment;
      // this.list[i].latest_Due_Date = due;
      // this.paymentList[i].due_Date = due;

      this.paymentDue = this.datePipe.transform(paymentDueDate,'MM/dd/yyyy');

      if(this.paymentDue !== null){

        var parsedNextDate = this.parseDate(this.paymentDue)
        var parsedToday = this.parseDate(this.today)

        var overdueTime = parsedToday.getTime() - parsedNextDate.getTime(); 
        this.overdueDays = overdueTime / (1000 * 3600 * 24);
        this.overdue = this.overdueDays

        if (this.overdueDays <= 0) {
          this.overdueBoolean = false;
        }else {
          this.overdueBoolean = true;
        }

        // this.overdueBoolean == this.list[i].overdue;
  
        if (this.list[i].overdue !== this.overdueBoolean){
          this.list[i].overdue = this.overdueBoolean
          this.list[i].latest_Due_Date = paymentDueDate;
          this.list[i].latest_Payment_Date = paymentOldDate;
        
     
  
  
          //update latest payment
          this.profiles.update(this.list[i].id,this.list[i]).subscribe(array =>{
            //(array);

            this.list[i].latest_Payment_Date = payment;
          },error => {
            //(error)
          })
        }
    

      }
      

      //write overdue to true
      
    }
  }

  addVendor(){
    this.router.navigate(['/add-vendor'])
  }

  overDue(){

    this.profiles.findAllOverdue().subscribe(data=> {
      this.overDueData = data;
      this.overdueLength = this.overDueData.length;
    })
  }

  paid(){
    this.profiles.findAllPaid().subscribe(data=> {
      this.paymentData = data;
      this.paidLength = this.paymentData.length;
    })
  }

  retrieveOverdue(){
    this.profiles.findAllOverdue().subscribe(data=> {
      this.overDueData = data;
      this.list = this.overDueData;


      this.loopData();

      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.list);
      this.listDataPrint.sort = this.sort;
      
      this.changeDetectorRefs.detectChanges();

    })
  }

  retrievePaid(){
    this.profiles.findAllPaid().subscribe(data=> {
      this.paidData = data;
      this.list = this.paidData;


      this.loopData();

      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.list);
      this.listDataPrint.sort = this.sort;

      this.changeDetectorRefs.detectChanges();

    })
  }



  //GRAPHIC SECTION ----- APEXCHART


  createChart(){

    this.slot.findAll().subscribe(data=> {
      this.slotData = data;
      this.slotLength = this.slotData.length;

      if (this.slotData.length !== 0){

        for(let i = 0; i<this.slotData.length;i++){
          var taken = this.slotData[i].taken;

          if(taken){
            this.takenSlot.push(this.slotData[i])
          } else {
            this.availableSlot.push(this.slotData[i])
          }
        }


      } else {

        return;

      }


      //(this.takenSlot)
      var takenSlot = parseInt(this.takenSlot.length);
      var available = parseInt(this.availableSlot.length)
      var Allslot = parseInt(this.slotData.length);
      var calc = (takenSlot/Allslot)*100;
      var availcalc = (available/Allslot)*100;
      var availcompare = Math.round(availcalc);
      var compare = Math.round(calc)

      this.chartNumber = compare;

      this.chartOptions = {
        series: [compare,availcompare],
        chart: {
          height: 365,
          type: "radialBar",
          background: "white"
        },
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 360,

            hollow: {
              margin: 5,
              size: "70%",
              background: "transparent",
              image: undefined
            },
            dataLabels: {
              name: {
                show:false
              },
              value: {
                show:false
              },
            }
          }
        },
        colors: ["pink"],
        labels: ["Slot Taken: "+takenSlot,"Slot Available: "+available],
        legend: {
          
          show: true,
          floating: true,
          fontSize: "12.5px",
          position: "left",
          offsetX: 60,
          offsetY: 120,
          labels: {
            useSeriesColors: true
          },
          formatter: function(seriesName, opts) {
            return seriesName + "  [" + opts.w.globals.series[opts.seriesIndex]+"%"+"]";
          },
          itemMargin: {
            horizontal: 3
          }
        },

        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                show: false
              }
            }
          }
        ]


      };
  
      
    })
    

   
  }

  createPieChart(){



      this.profiles.findAllOverdue().subscribe(data=> {
        this.overDueData = data;
        this.overdueLength = this.overDueData.length;

        this.profiles.findAllPaid().subscribe(data=> {
          this.paymentData = data;
          this.paidLength = this.paymentData.length;

          this.delProfileService.findAll().subscribe(data=> {

            this.discontinued = data;
            this.discontinuedlength = this.discontinued.length;

          var discontinueCount = parseInt(this.discontinuedlength);
          var overdue = parseInt(this.overdueLength);
          var paid = parseInt(this.paidLength);

          this.showPieChart = true;
        
          this.piechartOptions = {

            theme: {
              palette: 'palette3'
            },
           
            series: [paid,discontinueCount,overdue],
            chart: {
              height: 400,
              width: 500,
              type: "donut",
              background: "white"
              
            },

            
            
          labels: ["Paid: "+paid,"Discontinued: "+discontinueCount,"Overdue: "+overdue],

            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 350
                  },
                  legend: {
                    position: "bottom"
                  }
                }
              }
            ]
          };
          
        },error=>{
          //(error);
          return;
        })
          
        },error=> {
          //(error);
          return;
        })

      },error=> {
        //(error);
        return;
      })
    
  

     
    

  

  }

  createLineChart(){

    var payment = [];
    var dateArray = [];
    var totalPayment = 0;
    this.totalPayment = 0;
    this.paymentSeries = [];

    this.paymentService.findAll().subscribe(data=> {
      this.paymentArray = data;
      

      if(this.paymentArray !== 0){


        this.delPaymentService.findAll().subscribe(res=> {
          this.delPaymentArray = res;
         
          if (this.delPaymentArray.length !== 0){

            //(this.paymentArray)
  
            for (let i =0; i<this.delPaymentArray.length; i++){
           
              this.totalPayment += parseInt(this.delPaymentArray[i].price);
           
            }



            
        var paymentLength = this.paymentArray.length;
        var requested = 0;
  
        if (paymentLength-1 > 8){
          requested = paymentLength-9
        }

        //(this.paymentArray)

        for (let i = paymentLength-1; i>=requested;i--){
       
          this.paymentSeries.push(this.paymentArray[i].price)

          const newDate = new Date(this.paymentArray[i].createdAt);
          let latest_date = this.datePipe.transform(newDate,'dd/MM HH:mm')
          dateArray.push(latest_date)
        }

        for(let i = 0; i< paymentLength; i++){
          totalPayment += parseInt(this.paymentArray[i].price);
        }

        totalPayment += this.totalPayment;

    
      this.linechartOptions = {

        theme: {
          palette: 'palette8'
        },
     
        series1: [{
          name: "Payment ($):",
          data: this.paymentSeries,
        },
          
        ],

       
      
        chart: {
          height: 330,
          width: 460,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Latest Income Trend",
          align: "left",
          
        },
        
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.8
          }
        },
        xaxis: {
          categories: dateArray,
          title: {
            text: "Total Income: $" + totalPayment,
            style:{
              color: "black",
              fontFamily: "Sans-Serif",
              fontSize: "17px"
            }, 
          }
        }
      };
  
      } else {
            
        var paymentLength = this.paymentArray.length;
        var requested = 0;
  
        if (paymentLength-1 > 8){
          requested = paymentLength-9
        }

        //(this.paymentArray)

        for (let i = paymentLength-1; i>=requested;i--){
       
          this.paymentSeries.push(this.paymentArray[i].price)

          const newDate = new Date(this.paymentArray[i].createdAt);
          let latest_date = this.datePipe.transform(newDate,'dd/MM HH:mm')
          dateArray.push(latest_date)
        }

        for(let i = 0; i< paymentLength; i++){
          totalPayment += parseInt(this.paymentArray[i].price);
        }

        //(payment)
        //(totalPayment)

    
      this.linechartOptions = {

        theme: {
          palette: 'palette8'
        },
     
        series1: [{
          name: "Payment ($):",
          data: this.paymentSeries,
        },
          
        ],

       
      
        chart: {
          height: 330,
          width: 460,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Latest Income Trend",
          align: "left",
          
        },
        
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.8
          }
        },
        xaxis: {
          categories: dateArray,
          title: {
            text: "Total Income: $" + totalPayment,
            style:{
              color: "black",
              fontFamily: "Sans-Serif",
              fontSize: "17px"
            }, 
          }
        }
      };
          }

















        }, error=> {
          //(error)
        })
  
      



      }


      
      
    })







  }




  createLineChart1(){

    var payment = [];
    var dateArray = [];
    var totalPayment1 = 0;
    this.totalPayment1 = 0;
    this.paymentSeries1 = [];


    if (!this.dateFilter || !this.endFilter){
      return;
    }

    this.paymentService.findPaymentRange(this.dateFilter, this.endFilter).subscribe(data=> {
      this.paymentArray1 = data;
      //(data)
      

      if(this.paymentArray1.length !== 0){
         
        var paymentLength = this.paymentArray1.length;
        var requested = 0;

        //(this.paymentArray1)

        for (let i = paymentLength-1; i>=requested;i--){
       
          this.paymentSeries1.push(this.paymentArray1[i].price)

          const newDate = new Date(this.paymentArray1[i].createdAt);
          let latest_date = this.datePipe.transform(newDate,'dd/MM HH:mm')
          dateArray.push(latest_date)
        }

        for(let i = 0; i< paymentLength; i++){
          totalPayment1 += parseInt(this.paymentArray1[i].price);
        }

        totalPayment1 += this.totalPayment1;

    
      this.linechartOptions1 = {

        theme: {
          palette: 'palette8'
        },
     
        series1: [{
          name: "Payment ($):",
          data: this.paymentSeries1,
        },
          
        ],

       
      
        chart: {
          height: 430,
          width: 800,
          type: "line",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "straight"
        },
        title: {
          text: "Income Trend By Selected Date",
          align: "center",
          
        },
        
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.8
          }
        },
        xaxis: {
          categories: dateArray,
          title: {
            text: "Total Income: $" + totalPayment1,
            style:{
              color: "black",
              fontFamily: "Sans-Serif",
              fontSize: "17px"
            }, 
          }
        }
      };
  
      } 
          
      
    })







  }

  openSideProfile(id){
    
      //(id)


      this.slidePanel.open(SideProfileComponent, {
        slideFrom:'right',
        panelClass: "edit-modalbox1",
        data: {
          dataKey: id,
        }
      }).afterDismissed().subscribe(data=> {
        this.refreshData();
      })

  }


  retrieveID(username){
    this.accountService.findByUsername(username).subscribe(data=> {
      this.profileArray = data;
      //(this.profileArray)
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
    //(error)
  })
}

viewTable(){


  var searchFor = this.searchForField;
  this.selectSlotField = "All";
  this.locationField = "All";
  this.selectSlotField = "All";
  if (searchFor == "Vendor"){
    this.showVendor = true;
    this.showSlotField = false;
    this.showPayment = false;
    this.showRelative = false;

    this.refreshData();

  } else if (searchFor == "Location") {
    this.showSlotField = true;
    this.showRelative = false;
    this.showPayment = false;
    this.showVendor = false;
    this.refreshLocation();

  } else if (searchFor == "Payment"){
    this.showSlotField = false;
    this.showPayment = true;
    this.showRelative = false;
    this.showVendor = false;
    this.refreshPayment();

  } else if (searchFor == "Relative"){
    //("relative")
    this.showSlotField = false;
    this.showPayment = false;
    this.showRelative = true;
    this.showVendor = false;
    this.getRelative()

  } else {
    return;
  }
}


refreshLocation(){
  this.searchKey = "";
  this.selectField = "All";
  this.selectSlotField = "All";

  this.slot.findAll().subscribe(data=> {

    this.switchAllSlot = data;


    if (this.switchAllSlot.length !== 0){
     
        for (let i =0 ; i<this.switchAllSlot.length; i++){

          var rid = this.switchAllSlot[i].rid
        
          var profile = [];
          this.profiles.findByRid(rid).subscribe(data => {
              profile = data;

              if(profile.length == 0){
                this.switchAllSlot[i].IC_Number = "";
                this.switchAllSlot[i].name = "";
                this.switchAllSlot[i].overdue = "N/A";
              } else {
                this.switchAllSlot[i].IC_Number = profile[0].IC_Number;
                this.switchAllSlot[i].name = profile[0].name;
                this.switchAllSlot[i].overdue = profile[0].overdue;
              }

              
          })
        }

        this.filteredArray = this.switchAllSlot;

        this.listData = new MatTableDataSource(this.switchAllSlot);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.switchAllSlot);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();


    } else {
      
      this.listData = new MatTableDataSource(this.switchAllSlot);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.switchAllSlot);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    }

  })

}


refreshPayment() {
  this.searchKey = "";
  this.dateFilter = "";
  this.endFilter = "";
  this.notificationField = "All";

  this.paymentService.findAll().subscribe(data=> {
    this.paymentTableArray = data;

    if (this.paymentTableArray !== 0){

      for (let i = 0; i<this.paymentTableArray.length;i++){
        var rid = this.paymentTableArray[i].rid;
        var paymentDate = new Date (this.paymentTableArray[i].payment_Date);
        var dueDate = new Date (this.paymentTableArray[i].due_Date);

        let latestPayment = this.datePipe.transform(paymentDate,'dd/MM/YY HH:mm');
        let latestDue = this.datePipe.transform(dueDate, 'dd/MM/YY HH:mm')

        this.paymentTableArray[i].payment_Date = latestPayment;
        this.paymentTableArray[i].due_Date = latestDue;

        var profile = [];

        this.profiles.findByRid(rid).subscribe(data=> {
          profile = data;

          if(profile.length == 0){
            this.paymentTableArray[i].IC_Number = "";
            this.paymentTableArray[i].name = "";
            this.paymentTableArray[i].overdue = "N/A";
            this.paymentTableArray[i].slot_Number = "";
          } else {
            this.paymentTableArray[i].IC_Number = profile[0].IC_Number;
            this.paymentTableArray[i].name = profile[0].name;
            this.paymentTableArray[i].overdue = profile[0].overdue;
            this.paymentTableArray[i].slot_Number = profile[0].slot;
          }

        })
        
      }

      

      this.listData = new MatTableDataSource(this.paymentTableArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.paymentTableArray);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();


    } else {
      this.listData = new MatTableDataSource(this.paymentTableArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.listDataPrint = new MatTableDataSource(this.paymentTableArray);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
      return;
    }
  })

}

getRelative(){
  this.searchKey = "";
  this.spouseField ="All";

  this.relativeService.findAll().subscribe(data=> {
    this.spouseArray = data;


    if (this.spouseArray.length !== 0){

      for (let i = 0 ; i<this.spouseArray.length;i++){

        var rid = this.spouseArray[i].rid
    
        var newDate = new Date(this.spouseArray[i].updatedAt);
      
        let myDate = this.datePipe.transform(newDate,'dd/MM/YY HH:mm');
        this.spouseArray[i].updatedAt = myDate;
        var profile = []

        this.profiles.findByRid(rid).subscribe(data=> {
          profile = data;


          if(profile.length == 0){
            this.spouseArray[i].vendorIC_Number = "";
            this.spouseArray[i].vendorName = "";
            this.spouseArray[i].overdue = "N/A";
      
          } else {
            this.spouseArray[i].vendorIC_Number = profile[0].IC_Number;
            this.spouseArray[i].vendorName = profile[0].name;
            this.spouseArray[i].overdue = profile[0].overdue;
          }






        })


      }
  

      this.listData = new MatTableDataSource(this.spouseArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.spouseArray);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();


     
    } else {

      this.listData = new MatTableDataSource(this.spouseArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.spouseArray);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    }


  })

}

overdueSlotFilter(){
  var array = [];
  var filter = this.filteredArray;
  //(this.filteredArray)
  
  if (this.selectField == "All"){

    this.listData = new MatTableDataSource(this.filteredArray);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;

    this.listDataPrint = new MatTableDataSource(this.filteredArray);
    this.listDataPrint.sort = this.sort;
    this.changeDetectorRefs.detectChanges();


  } else if (this.selectField == "Overdue"){
    //("Overdue")

    
    if (filter.length !== 0){

      for (let i = 0; i< filter.length; i++){
        var condition = filter[i];
        //(condition)
        if (filter[i].overdue == true){
          array.push(filter[i]);
          
        }
  
      }

      //(array)

      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(array);
      this.listDataPrint.sort = this.sort;

      this.changeDetectorRefs.detectChanges();
    }
    
  
  } else if ("Paid") {

    //("Paid")

    if (filter.length !== 0){

      for (let i = 0; i< filter.length; i++){
        //(filter[i].overdue)
        if (filter[i].overdue == false){
          array.push(filter[i]);
          
        }
  
      }

      //(array)

      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(array);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
    }

  }
  
 
 
}

slotAvailability(){
  var availArray = [];
  var newArray = this.switchAllSlot;
  if (this.selectSlotField == "All"){

    this.listData = new MatTableDataSource(this.switchAllSlot);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;

    this.listDataPrint = new MatTableDataSource(this.switchAllSlot);
    this.listDataPrint.sort = this.sort;
    this.changeDetectorRefs.detectChanges();



  } else if (this.selectSlotField == "Taken"){

    if (newArray.length !==0){

      for (let i = 0; i<newArray.length; i++){


        if (newArray[i].taken==true){
          availArray.push(newArray[i])
        }
      }
      
      this.filteredArray = availArray;
      //(availArray)

      if (this.selectField !=="All"){
        this.overdueSlotFilter();
      } else {


        this.listData = new MatTableDataSource(availArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(availArray);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();

      }
    
     


    } 



  }else if (this.selectSlotField == "Available"){


    if (newArray.length !==0){

      for (let i = 0; i<newArray.length; i++){


        if (newArray[i].taken==false){
          availArray.push(newArray[i])
        }
      }

      this.filteredArray = availArray;
      
      if (this.selectField !=="All"){
        this.overdueSlotFilter();
      } else {


        
      this.listData = new MatTableDataSource(availArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(availArray);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
      }
    


    } 
      
  }
}

showTable(){

  this.selectField = "All"

  if (this.locationField=="All"){
    this.refreshLocation();
  } else {


    this.slot.findByLocation(this.locationField).subscribe(data=> {

      this.switchAllSlot = data;
  
  
      if (this.switchAllSlot.length !== 0){
       
          for (let i =0 ; i<this.switchAllSlot.length; i++){
  
            var rid = this.switchAllSlot[i].rid
          
            var profile = [];
            this.profiles.findByRid(rid).subscribe(data => {
                profile = data;
  
                if(profile.length == 0){
                  this.switchAllSlot[i].IC_Number = "";
                  this.switchAllSlot[i].name = "";
                  this.switchAllSlot[i].overdue = "N/A";
                } else {
                  this.switchAllSlot[i].IC_Number = profile[0].IC_Number;
                  this.switchAllSlot[i].name = profile[0].name;
                  this.switchAllSlot[i].overdue = profile[0].overdue;
                }
  
                
            })
          }

          this.filteredArray = this.switchAllSlot;
          //(this.filteredArray)

          if (this.selectSlotField !== "All"){
            this.slotAvailability();
          } else {

            
          this.listData = new MatTableDataSource(this.switchAllSlot);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;

          this.listDataPrint = new MatTableDataSource(this.switchAllSlot);
          this.listDataPrint.sort = this.sort;
          this.changeDetectorRefs.detectChanges();
          }
  
  
      } else {
        
        this.listData = new MatTableDataSource(this.switchAllSlot);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.switchAllSlot);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
      }
  
    })

  }
 
}






overdueFilter(){
  
  var searchFor = this.searchForField;
  var status = this.selectField;
  

  if (searchFor == "Vendor"){
    


    switch (status){
      case "Overdue": {


        this.retrieveOverdue();


        break;
      }

      case "Paid": {

        this.retrievePaid();
        break;
      }

      case "All": {
        this.refreshData();
      }
    }

  

  } else {
    return;
  }


}


notificationFilter(){

  this.dateFilter = "";
  this.endFilter="";


  if (this.notificationField == "All"){
    this.refreshPayment();
  } else if (this.notificationField == "Sent"){

    

    
    
  this.paymentService.findSent().subscribe(data=> {
    this.paymentTableArray = data;
   
    if (this.paymentTableArray !== 0){

      for (let i = 0; i<this.paymentTableArray.length;i++){
        var rid = this.paymentTableArray[i].rid;
        
        var paymentDate = new Date (this.paymentTableArray[i].payment_Date);
        var dueDate = new Date (this.paymentTableArray[i].due_Date);

        let latestPayment = this.datePipe.transform(paymentDate,'dd/MM/YY HH:mm');
        let latestDue = this.datePipe.transform(dueDate, 'dd/MM/YY HH:mm')

        this.paymentTableArray[i].payment_Date = latestPayment;
        this.paymentTableArray[i].due_Date = latestDue;

        var profile = [];

        this.profiles.findByRid(rid).subscribe(data=> {
          profile = data;

          if(profile.length == 0){
            this.paymentTableArray[i].IC_Number = "";
            this.paymentTableArray[i].name = "";
            this.paymentTableArray[i].overdue = "N/A";
            this.paymentTableArray[i].slot_Number = "";
          } else {
            this.paymentTableArray[i].IC_Number = profile[0].IC_Number;
            this.paymentTableArray[i].name = profile[0].name;
            this.paymentTableArray[i].overdue = profile[0].overdue;
            this.paymentTableArray[i].slot_Number = profile[0].slot;
          }

        })
        
      }

    
      

      this.listData = new MatTableDataSource(this.paymentTableArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.paymentTableArray);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();


    } else {
      this.listData = new MatTableDataSource(this.paymentTableArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;

      this.listDataPrint = new MatTableDataSource(this.paymentTableArray);
      this.listDataPrint.sort = this.sort;
      this.changeDetectorRefs.detectChanges();
      return;
    }
  })


    







  } else if (this.notificationField == "NotDelivered"){


    this.paymentService.findNotDelivered().subscribe(data=> {
      this.paymentTableArray = data;
    
  
      if (this.paymentTableArray !== 0){
  
        for (let i = 0; i<this.paymentTableArray.length;i++){
          var rid = this.paymentTableArray[i].rid;
          var paymentDate = new Date (this.paymentTableArray[i].payment_Date);
          var dueDate = new Date (this.paymentTableArray[i].due_Date);
  
          let latestPayment = this.datePipe.transform(paymentDate,'dd/MM/YY HH:mm');
          let latestDue = this.datePipe.transform(dueDate, 'dd/MM/YY HH:mm')
  
          this.paymentTableArray[i].payment_Date = latestPayment;
          this.paymentTableArray[i].due_Date = latestDue;
  
          var profile = [];
  
          this.profiles.findByRid(rid).subscribe(data=> {
            profile = data;
  
            if(profile.length == 0){
              this.paymentTableArray[i].IC_Number = "";
              this.paymentTableArray[i].name = "";
              this.paymentTableArray[i].overdue = "N/A";
              this.paymentTableArray[i].slot_Number = "";
            } else {
              this.paymentTableArray[i].IC_Number = profile[0].IC_Number;
              this.paymentTableArray[i].name = profile[0].name;
              this.paymentTableArray[i].overdue = profile[0].overdue;
              this.paymentTableArray[i].slot_Number = profile[0].slot;
            }
  
          })
          
        }
  

  
        this.listData = new MatTableDataSource(this.paymentTableArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.paymentTableArray);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
  
  
      } else {
        this.listData = new MatTableDataSource(this.paymentTableArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.paymentTableArray);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
        return;
      }
    })
  
  
      

  }

}



onChangeDate(){

  this.paymentNewArray = [];


  if (!this.dateFilter || !this.endFilter){
    Swal.fire('Info','Please Enter Start Date and End Date','info')
    return;

  } else {

    this.createLineChart1();


    this.paymentService.findPaymentRange(this.dateFilter,this.endFilter).subscribe(data=> {
      this.rangeDataArray = data;

      //(this.rangeDataArray)

      if (this.rangeDataArray.length !== 0){

       
          
          for (let i = 0;i<this.rangeDataArray.length;i++){

            for (let k = 0; k<this.paymentTableArray.length;k++){

              if (this.rangeDataArray[i].paymentID == this.paymentTableArray[k].paymentID){
                // this.paymentTableArray.splice(i,0)
                //("masuk dah")
                this.paymentNewArray.push(this.paymentTableArray[k])
              }

            }
          }


          this.listData = new MatTableDataSource(this.paymentNewArray);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
  
          this.listDataPrint = new MatTableDataSource(this.paymentNewArray);
          this.listDataPrint.sort = this.sort;
          this.changeDetectorRefs.detectChanges();
        
      }
      
    })
  }
}

spouseFilter(){

  if (this.spouseField == "All"){

  this.getRelative();

  } else if (this.spouseField == "Spouse") {
    
    this.relativeService.findSpouseOnly().subscribe(data=> {
      this.spouseArray = data;
  
  
      if (this.spouseArray.length !== 0){
  
        for (let i = 0 ; i<this.spouseArray.length;i++){
  
          var rid = this.spouseArray[i].rid
      
          var newDate = new Date(this.spouseArray[i].updatedAt);
        
          let myDate = this.datePipe.transform(newDate,'dd/MM/YY HH:mm');
          this.spouseArray[i].updatedAt = myDate;
          var profile = []
  
          this.profiles.findByRid(rid).subscribe(data=> {
            profile = data;
  
  
            if(profile.length == 0){
              this.spouseArray[i].vendorIC_Number = "";
              this.spouseArray[i].vendorName = "";
              this.spouseArray[i].overdue = "N/A";
        
            } else {
              this.spouseArray[i].vendorIC_Number = profile[0].IC_Number;
              this.spouseArray[i].vendorName = profile[0].name;
              this.spouseArray[i].overdue = profile[0].overdue;
            }
  
  
  
  
  
  
          })
  
  
        }
    
      
        this.listData = new MatTableDataSource(this.spouseArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.spouseArray);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
  
  
       
      } else {
     
        this.listData = new MatTableDataSource(this.spouseArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.spouseArray);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
      }
  
  
    })
    



  }else if (this.spouseField == "Child") {


    this.relativeService.findChildOnly().subscribe(data=> {
      this.spouseArray = data;
  
  
      if (this.spouseArray.length !== 0){
  
        for (let i = 0 ; i<this.spouseArray.length;i++){
  
          var rid = this.spouseArray[i].rid
      
          var newDate = new Date(this.spouseArray[i].updatedAt);
        
          let myDate = this.datePipe.transform(newDate,'dd/MM/YY HH:mm');
          this.spouseArray[i].updatedAt = myDate;
          var profile = []
  
          this.profiles.findByRid(rid).subscribe(data=> {
            profile = data;
  
  
            if(profile.length == 0){
              this.spouseArray[i].vendorIC_Number = "";
              this.spouseArray[i].vendorName = "";
              this.spouseArray[i].overdue = "N/A";
        
            } else {
              this.spouseArray[i].vendorIC_Number = profile[0].IC_Number;
              this.spouseArray[i].vendorName = profile[0].name;
              this.spouseArray[i].overdue = profile[0].overdue;
            }
  
  
  
  
  
  
          })
  
  
        }
    
     
        this.listData = new MatTableDataSource(this.spouseArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.spouseArray);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();


  
  
       
      } else {
     
        this.listData = new MatTableDataSource(this.spouseArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;

        this.listDataPrint = new MatTableDataSource(this.spouseArray);
        this.listDataPrint.sort = this.sort;
        this.changeDetectorRefs.detectChanges();
      }
  
  
    })

  }
}



goToEditPayment(element){
  this.dialog.open(EditPaymentComponent, {
    width: "800px",
      height: "90%",
      panelClass:'custom-modalbox',
      data:{
        dataKey: element
      }
  }).afterClosed().subscribe(data=> {
    this.refreshPayment();
  })
}


print(){
  var printwin = window.open("");
  printwin.document.write('<html><title>VMIS/Stat Report</title><link rel="stylesheet" href="assets/print.css"/><link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"> <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&amp;display=swap" rel="stylesheet"> </head><body>')
  printwin.document.write('<img class="logo" src="assets/Jabatan-Bandaran-Logo.png" width="400px" alt="logo"/><h3 style="color:black; font-size: 18px; font-weight: bold;margin-left:20px;">Statistical Report</h3><br><br>')
  printwin.document.write(document.getElementById("filter").innerHTML)
  printwin.document.write('<br><br>')
  printwin.document.write(document.getElementById("print").innerHTML)
  printwin.document.write('<br><br>')
  printwin.document.write(document.getElementById('statPrint').innerHTML)
  printwin.document.write('<br><br><br><br>')
  if (this.dateFilter && this.endFilter){
    printwin.document.write('<br><br><br>')
    printwin.document.write(document.getElementById('statprint-2').innerHTML)
    printwin.document.write('<br><br><br>')
  }

  printwin.document.write('</html>');



  setTimeout(()=> {
    printwin.print();
  },500)
 
}




















}
