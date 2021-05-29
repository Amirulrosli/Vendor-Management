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
  ApexTheme
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

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string [];
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  theme: ApexTheme


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
  takenSlotArray: any = [];
  availableSlotArray: any = [];
  locationField = "All";
  locationArray: any = [];
  paymentTableArray: any = []
  spouseArray: any = [];
  spouseField = "All";

  showPayment = false;
  showRelative = false;
  showVendor = true;
  notificationField = "All";
  dateFilter: any;
  filteredArray: any = [];




  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  listData: MatTableDataSource<any>;
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
    
    this.createChart();
    this.createPieChart();
    this.createLineChart();
    this.findOnlineUser();
    this.getLocation();



  }

  getLocation(){
    this.locationService.findAll().subscribe(data=> {
      this.locationArray = data;
    },error=> {
      console.log(this.locationArray)
    })
  }

  //identify if user is admin
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
      console.log(error)
    })

  }

  refreshOnline(){
    console.log(this.loginStateArray)
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
  }

  onDelete(data){
  

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
          title: 'Account Deleted'+' '+data.name, 
          description: 'Vendor profile with \n name: '+data.name+'\n Account ID: '+data.rid+'\n was deleted !',
          category: 'Deleted vendor profile',
          date: date,
          view: false
        };
  
        this.notification.create(notify).subscribe(resp=> {
          
        },error=> {
          console.log(error)
        });


        var profile = []
        this.profiles.findByRid(data.rid).subscribe(data=> {
          profile = data;

          if(profile.length !==0){
            this.delProfileService.create(profile[0]).subscribe(data=> {
              console.log(data)
            },error=> {
              console.log(error)
            })
          }

        })


        //Deleting Payment Service --------------------------------------------------------------------

        this.paymentService.findByRid(data.rid).subscribe(resp=> {
          this.paymentRid = resp;
        

          if (this.paymentRid.length > 0){
            for (let i = 0; i < this.paymentRid.length; i++){
              this.delPaymentService.create(this.paymentRid[i]).subscribe(data=> {
                console.log(data)

                this.paymentService.delete(this.paymentRid[i].id).subscribe(data=> {
                  console.log(data);
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


        //Updating Slot Service------------------------------------------------------------

        this.slot.findByRid(data.rid).subscribe(resp=> {  
          this.slotRid = resp;

          if (this.slotRid.length !== 0){

            this.slotRid[0].rid = null;      
            this.slotRid[0].taken = false;      
              this.slot.update(this.slotRid[0].id,this.slotRid[0]).subscribe(data=> {
                console.log(data);
              },error=> {
                console.log(error)
              })
            
          }
        },error=> {
          console.log(error)
        })


        //Deleting Payment Service -----------------------------------------------------------------------------

        var relative = [];
        this.relativeService.findByrid(data.rid).subscribe(data=> {
          relative = data;

          if (relative.length !== 0){

            for (let i = 0; i<relative.length; i++){
              this.delRelativeService.createRelative(relative[i]).subscribe(data=> {
                console.log(data)
                this.relativeService.delete(relative[i].id).subscribe(data=> {
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

        this.attachmentService.findByVendorid(data.rid).subscribe(data=> {
          attachments = data;

          if (attachments.length !== 0){
            for (let i =0; i<attachments.length;i++){
              this.delAttachmentService.create(attachments[i]).subscribe(data=> {
                console.log(data)

                this.attachmentService.delete(attachments[i].id).subscribe(data=> {
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
        this.remarkService.findByRid(data.rid).subscribe(data=> {
          remark = data;

          if (remark.length !== 0){

            this.delRemarkService.create(remark[0]).subscribe(data=> {
              console.log(data)

              this.remarkService.delete(remark[0].id).subscribe(data=> {
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
        this.photoService.findByRid(data.rid).subscribe(data=> {
          photo = data;

          if (photo.length !== 0){
            this.delPhotoService.create(photo[0]).subscribe(data=> {
              console.log(data);

              this.photoService.delete(photo[0].id).subscribe(data=> {
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
      console.log(resp)

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
        this.createChart();
        this.createPieChart();
      });
    }, error=> {
      console.log(error)
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
        this.createChart();
        this.createPieChart();
    })
  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
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

      console.log(this.list)

      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();

    })

    this.username = localStorage.getItem("username");
    this.role = localStorage.getItem("role")
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
            console.log(array);

            this.list[i].latest_Payment_Date = payment;
          },error => {
            console.log(error)
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


      console.log(this.takenSlot)
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
            hollow: {
              size: "70%"
            },
            dataLabels: {
              name: {
                fontSize: "22px"
              },
              value: {
                fontSize: "16px"
              },
              total: {
                show: true,
                label: "Total",
                formatter: function(w) {
                  return ""+Allslot+" Slots";
                }
              }
            }
          }
        },
        colors: ["pink"],
        labels: ["Slot Taken: "+takenSlot,"Slot Available: "+available]

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


          var overdue = parseInt(this.overdueLength);
          var paid = parseInt(this.paidLength);

          this.showPieChart = true;
        
          this.piechartOptions = {

            theme: {
              palette: 'palette3'
            },
           
            series: [paid,2,overdue],
            chart: {
              height: 400,
              width: 500,
              type: "donut",
              background: "white"
            },
            labels: ["Paid","Discontinued","Overdue"],
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
  
          
        },error=> {
          console.log(error);
          return;
        })

      },error=> {
        console.log(error);
        return;
      })
    
  

     
    

  

  }

  createLineChart(){

    var payment = [];
    var dateArray = [];

    this.paymentService.findAll().subscribe(data=> {
      this.paymentArray = data;
      console.log(this.paymentArray)

      var paymentLength = this.paymentArray.length;
      var requested = 0;
      var totalPayment = 0;

      if (paymentLength-1 > 8){
        requested = paymentLength-9
      }

      if(this.paymentArray !== 0){

        for (let i = paymentLength-1; i>=requested;i--){
       
          payment.push(this.paymentArray[i].price)

          const newDate = new Date(this.paymentArray[i].createdAt);
          let latest_date = this.datePipe.transform(newDate,'dd/MM HH:mm')
          dateArray.push(latest_date)
        }

        for(let i = 0; i< paymentLength; i++){
          totalPayment += parseInt(this.paymentArray[i].price);
        }


        
      this.linechartOptions = {

        theme: {
          palette: 'palette8'
        },
     
        series1: [{
          name: "Payment ($):",
          data: payment,
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
    console.log("relative")
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
        this.changeDetectorRefs.detectChanges();


    } else {
      
      this.listData = new MatTableDataSource(this.switchAllSlot);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();
    }

  })

}


refreshPayment() {
  this.searchKey = "";
  this.dateFilter = "";
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
      this.changeDetectorRefs.detectChanges();


    } else {
      this.listData = new MatTableDataSource(this.paymentTableArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
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
      this.changeDetectorRefs.detectChanges();


     
    } else {

      this.listData = new MatTableDataSource(this.spouseArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();
    }


  })

}

overdueSlotFilter(){
  var array = [];
  var filter = this.filteredArray;
  console.log(this.filteredArray)
  
  if (this.selectField == "All"){

    this.listData = new MatTableDataSource(this.filteredArray);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    this.changeDetectorRefs.detectChanges();


  } else if (this.selectField == "Overdue"){
    console.log("Overdue")

    
    if (filter.length !== 0){

      for (let i = 0; i< filter.length; i++){
        var condition = filter[i];
        console.log(condition)
        if (filter[i].overdue == true){
          array.push(filter[i]);
          
        }
  
      }

      console.log(array)

      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();
    }
    
  
  } else if ("Paid") {

    console.log("Paid")

    if (filter.length !== 0){

      for (let i = 0; i< filter.length; i++){
        console.log(filter[i].overdue)
        if (filter[i].overdue == false){
          array.push(filter[i]);
          
        }
  
      }

      console.log(array)

      this.listData = new MatTableDataSource(array);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
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
    this.changeDetectorRefs.detectChanges();



  } else if (this.selectSlotField == "Taken"){

    if (newArray.length !==0){

      for (let i = 0; i<newArray.length; i++){


        if (newArray[i].taken==true){
          availArray.push(newArray[i])
        }
      }
      
      this.filteredArray = availArray;
      console.log(availArray)

      if (this.selectField !=="All"){
        this.overdueSlotFilter();
      } else {


        this.listData = new MatTableDataSource(availArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
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
          console.log(this.filteredArray)

          if (this.selectSlotField !== "All"){
            this.slotAvailability();
          } else {

            
          this.listData = new MatTableDataSource(this.switchAllSlot);
          this.listData.sort = this.sort;
          this.listData.paginator = this.paginator;
          this.changeDetectorRefs.detectChanges();
          }
  
  
      } else {
        
        this.listData = new MatTableDataSource(this.switchAllSlot);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
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
      this.changeDetectorRefs.detectChanges();


    } else {
      this.listData = new MatTableDataSource(this.paymentTableArray);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
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
        this.changeDetectorRefs.detectChanges();
  
  
      } else {
        this.listData = new MatTableDataSource(this.paymentTableArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.changeDetectorRefs.detectChanges();
        return;
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
        this.changeDetectorRefs.detectChanges();
  
  
       
      } else {
     
        this.listData = new MatTableDataSource(this.spouseArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
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
        this.changeDetectorRefs.detectChanges();
  
  
       
      } else {
     
        this.listData = new MatTableDataSource(this.spouseArray);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
        this.changeDetectorRefs.detectChanges();
      }
  
  
    })

  }
}



onChangeDate(){
  var newDate = this.datePipe.transform(this.dateFilter,'dd/MM/YY')


  this.listData.filter = newDate.trim().toLowerCase();
}



















}
