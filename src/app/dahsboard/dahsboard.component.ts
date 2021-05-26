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
  loginArray: any = []
  loginModel: OnlineModel[];
  photoArray: any = [];
  profilePhoto:any;
  profileID: any;
  picArray:any;
  profilePic: any
  switchAllSlot: any = []
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
    "IC_Number",
    "location",
    "slot_Number",
    "slot_Price",
    "name",
    "taken",
    "overdue",
    "actions",
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
    private payment: paymentService,
    private accountService: accountService,
    private loginStateService: loginStateService,
    private photoService: photoService
  ) { 

    this.close = false;
  }



  ngOnInit(): void {

    this.showSlotField = false;

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
          console.log(resp)
        },error=> {
          console.log(error)
        });

        this.payment.findByRid(data.rid).subscribe(resp=> {
          this.paymentRid = resp;
          console.log(resp)

          if (this.paymentRid.length > 0){
            for (let i = 0; i < this.paymentRid.length; i++){
              this.payment.delete(this.paymentRid[i].id).subscribe(data=> {
                console.log(data);
              }, error=> {
                console.log(error)
              })
            }
          }
        }, err=> {
          console.log(err)
        })

        this.slot.findByRid(data.rid).subscribe(resp=> {  //testing delete slot
          this.slotRid = resp;

          if (this.slotRid.length > 0){
            for (let i = 0 ; i <this.slotRid.length; i++){
              this.slot.delete(this.slotRid[i].id).subscribe(data=> {
                console.log(data);
              },error=> {
                console.log(error)
              })
            }
          }
        },error=> {
          console.log(error)
        })

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
          
        },err=> {
          console.log(err)
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
    })
  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }


  refreshData(){
    this.showSlotField = false;
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

    this.payment.findAll().subscribe(data=> {
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
          console.log(this.paymentArray[i])
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



onChange(value) {
  var searchFor = this.searchForField;
  var statusField = this.selectField;

  switch (searchFor){
    case "Vendor": {

      this.showSlotField = false;
      if (statusField == "All"){
        this.refreshData();
        break;
      } else if (statusField == "Overdue"){
        this.retrieveOverdue();
        break;
      } else if (statusField == "Paid") {
        this.retrievePaid();
        break;
      } else {
        break;
      }
      
    
    }

    case "Location": {

      this.showSlotField = true;
      var selectSlot = this.selectSlotField

      switch(statusField) {

        case "All": {
          if (selectSlot == "All"){
            
            break;
          } else if (selectSlot == "Taken"){
           
            break;
          } else {
         
            break;
          }
        } 
        case "Overdue": {

          if (selectSlot== "All"){
            break;
          } else if (selectSlot == "True"){
            break;
          } else {
            break;
          }
          
        }

        case "Paid": {
          if (selectSlot == "All"){
            break;
          } else if (selectSlot == "True"){
            break;
          } else {
            break;
          }
        }

      }

      break;
    

    }

    case "Payment": {
      this.showSlotField = false;
      this.retrievePaid();
      break;
    }

    case "Spouse": {
      this.showSlotField = false;
      this.retrievePaid();
      break;
    }

    case "Child": {
      this.showSlotField = false;
      this.retrievePaid();
      break;
    }
  }
}


// retrieveAllSlot(condition){
  
//     if (condition == "Taken"){
//     condition = true;
//     } else if (condition == "Available"){
//       condition = false;
//     }

//     if (condition == "All"){

//       this.slot.findAll().subscribe(data=> {
//         this.switchAllSlot = data;

//         if (this.switchAllSlot.length !== 0){


//           for (let i = 0 ; i< this.switchAllSlot.length; i++){
//             var rid = this.switchAllSlot[i].rid;
//             var profileArray = [];
//             this.profiles.findByRid(rid).subscribe(data=> {
//               profileArray = data;

//               if (profileArray.length == 0 || this.switchAllSlot[i].taken==false){
//                 this.switchAllSlot[i].name = "N/A";
//                 this.switchAllSlot[i].overdue = "N/A";
//                 this.switchAllSlot[i].IC_Number = "N/A";

//               }
//               else {
//                 this.switchAllSlot[i].name = profileArray[0].name;
//                 this.switchAllSlot[i].overdue = profileArray[0].overdue;
//                 this.switchAllSlot[i].IC_Number = profileArray[0].IC_Number;
//               }
              

          
//             })
//           }

//           this.refreshSlot();


//         }
//         else {
//           return;
//         }
//       })

//     } else {

     

//       console.log(condition)

      
//       this.slot.findbytaken(condition).subscribe(data=> {
//         this.switchAllSlot = data;

//         if (this.switchAllSlot.length !== 0){


//           for (let i = 0 ; i< this.switchAllSlot.length; i++){
//             var rid = this.switchAllSlot[i].rid;
//             var profileArray = [];
//             this.profiles.findByRid(rid).subscribe(data=> {
//               profileArray = data;

//               if (profileArray.length == 0){
//                 this.switchAllSlot[i].name = "N/A";
//                 this.switchAllSlot[i].overdue = "N/A";
//                 this.switchAllSlot[i].IC_Number = "N/A";

//               } else {
//                 this.switchAllSlot[i].name = profileArray[0].name;
//                 this.switchAllSlot[i].status = profileArray[0].status;
//                 this.switchAllSlot[i].IC_Number = profileArray[0].IC_Number;
//               }

             

        
//             })
//           }

//           this.refreshSlot();
//         } else {
//           return;
//         }
//       })

//     }

 
// }




refreshSlot(){

  console.log(this.switchAllSlot)
  this.listData = new MatTableDataSource(this.switchAllSlot);
  this.listData.sort = this.sort;
  this.listData.paginator = this.paginator;
  this.changeDetectorRefs.detectChanges();

}


























}
