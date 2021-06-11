import { DatePipe, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexNonAxisChartSeries, ApexPlotOptions, ApexResponsive, ApexStroke, ApexTheme, ApexTitleSubtitle, ApexXAxis, ChartComponent } from 'ng-apexcharts';
import { accountService } from '../services/account.service';
import { attachmentService } from '../services/Attachment.service';
import { paymentService } from '../services/payment.service';
import { photoService } from '../services/photo.service';
import { profileService } from '../services/profile.service';
import { relativeService } from '../services/relative.service';
import { slotService } from '../services/slot.service';
import { DelattachmentService } from '../servicesDeleted/Attachment.service';
import { DelpaymentService } from '../servicesDeleted/payment.service';
import { DelphotoService } from '../servicesDeleted/photo.service';
import { DelprofileService } from '../servicesDeleted/profile.service';
import { DelrelativeService } from '../servicesDeleted/relative.service';


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
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {


  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  @ViewChild("piechart") piechart: ChartComponent;
  public piechartOptions: Partial<ChartOptions>;

  @ViewChild("linechart") linechart: ChartComponent;
  public linechartOptions: Partial<ChartOptions>;
  

  profileArray: any = [];
  paymentArray: any = [];
  slotArray: any = [];
  relativeArray: any = [];
  attachmentArray: any =[];
  profilePic: any;






  delprofileArray: any = [];
  delpaymentArray: any = [];
  delslotArray: any = [];
  delrelativeArray: any = [];
  delattachmentArray: any =[];
  delprofilePic: any;



  
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  listData: MatTableDataSource<any>;



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
    private location: Location,
    private profileService: profileService,
    private paymentService: paymentService,
    private slotService: slotService,
    private relativeService: relativeService,
    private attachmentService: attachmentService,
    private photoService: photoService,

    private delPaymentService: DelpaymentService,
    private delProfileService: DelprofileService,
    private delRelativeService: DelrelativeService,
    private delAttachmentService: DelattachmentService,
    private delPhotoService: DelphotoService,
    private datePipe: DatePipe

    
    
  ) { }

  ngOnInit(): void {

    this.getProfiles();
    this.getAttachment();
    this.getRelative();
    this.getPayment();
    this.getRelative();
    this.getSlot();

  }

  printPage(){
    window.print();
  }


  getProfiles(){

    this.profileService.findAll().subscribe(data=> {
      this.profileArray = data;

      if (this.profileArray.length !== 0){
        for (let i = 0; i<this.profileArray.length ;i++){

          var photo = [];

          this.photoService.findByRid(this.profileArray[i].rid).subscribe(data=> {
            photo = data;

            if (photo.length !== 0){
              var baseURL = this.photoService.baseURL();
              var link = baseURL+"/"+photo[0].link;

              this.profilePic = link;
            }
          })
        }

        this.profileArray = this.profileArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });
      }

      
    },error=> {
      console.log(error)
    })


    //DelProfile --- retrieval


    this.delProfileService.findAll().subscribe(data=> {
      this.delprofileArray = data;

      if (this.delprofileArray.length !== 0){
        for (let i = 0; i<this.delprofileArray.length ;i++){

          var photo = [];

          this.delPhotoService.findByRid(this.delprofileArray[i].rid).subscribe(data=> {
            photo = data;

            if (photo.length !== 0){
              var baseURL = this.delPhotoService.baseURL();
              var link = baseURL+"/"+photo[0].link;

              this.delprofilePic = link;
            }
          })
        }

        this.delprofileArray = this.delprofileArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });
      }
    },error=> {
      console.log(error)
    })
  }

  getPayment(){
    this.paymentService.findAll().subscribe(data=> {
      this.paymentArray = data;

      if (this.paymentArray !==0){
        for (let i = 0; i< this.paymentArray.length; i++){
          var paymentDate = new Date (this.paymentArray[i].payment_Date);
          let payment = this.datePipe.transform(paymentDate,'dd/MM/YYYY HH:mm');

          var dueDate = new Date (this.paymentArray[i].due_Date);
          let due = this.datePipe.transform(dueDate,'dd/MM/YYYY HH:mm');

          this.paymentArray[i].payment_Date = payment;
          this.paymentArray[i].due_Date = due;
          var profile = [];
          this.profileService.findByRid(this.paymentArray[i].rid).subscribe(data=> {
            profile = data;

            if (profile.length !==0){
              this.paymentArray[i].slot = profile[0].slot;
              this.paymentArray[i].slot_Price = profile[0].slot_Price;
              this.paymentArray[i].name = profile[0].name;
            }
          },error=> {
            console.log(error)
          })
        }

        



        this.paymentArray = this.paymentArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });
      }
    },error=>{
      console.log(error)
    })


    //DelPaymentRetrieval


    this.delPaymentService.findAll().subscribe(data=> {
      this.delpaymentArray = data;

      if (this.delpaymentArray !==0){
        for (let i = 0; i< this.delpaymentArray.length; i++){
          var paymentDate = new Date (this.delpaymentArray[i].payment_Date);
          let payment = this.datePipe.transform(paymentDate,'dd/MM/YYYY HH:mm');

          var dueDate = new Date (this.delpaymentArray[i].due_Date);
          let due = this.datePipe.transform(dueDate,'dd/MM/YYYY HH:mm');

          this.delpaymentArray[i].payment_Date = payment;
          this.delpaymentArray[i].due_Date = due;
          var profile = [];
          this.delProfileService.findByRid(this.delpaymentArray[i].rid).subscribe(data=> {
            profile = data;

            if (profile.length !==0){
              this.delpaymentArray[i].slot = profile[0].slot;
              this.delpaymentArray[i].slot_Price = profile[0].slot_Price;
              this.delpaymentArray[i].name = profile[0].name;
            }
          },error=> {
            console.log(error)
          })
        }


        this.delpaymentArray = this.delpaymentArray.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }
    },error=>{
      console.log(error)
    })





  }

  getSlot(){
    this.slotService.findAll().subscribe(data=> {
      this.slotArray = data;

      if (this.slotArray.length !== 0){
        for (let i = 0; i<this.slotArray.length ;i++){

          var profile = [];
          this.profileService.findByRid(this.slotArray[i].rid).subscribe(data=> {
            profile = data;

            if (profile.length !==0){
              this.slotArray[i].name = profile[0].name;
             
            } else {
              this.slotArray[i].name = ""
            }
          },error=> {
            console.log(error)
          })
        }

        this.slotArray = this.slotArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });
      }
    },error=> {
      console.log(error)
    })
  }



  getRelative(){


    this.relativeService.findAll().subscribe(data=> {
      this.relativeArray = data;

      if (this.relativeArray.length !== 0){
        for (let i = 0; i<this.relativeArray.length ;i++){

          var profile = [];
          this.profileService.findByRid(this.relativeArray[i].rid).subscribe(data=> {
            profile = data;

            if (profile.length !==0){
              this.relativeArray[i].vendorname = profile[0].name;
             
            }
          },error=> {
            console.log(error)
          })
        }

        this.relativeArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });


        console.log(this.relativeArray)
      }
    },error=> {
      console.log(error)
    })


    //deleted relative array


    this.delRelativeService.findAll().subscribe(data=> {
      this.delrelativeArray = data;

      if (this.delrelativeArray.length !== 0){
        for (let i = 0; i<this.delrelativeArray.length ;i++){

          var profile = [];
          this.delProfileService.findByRid(this.delrelativeArray[i].rid).subscribe(data=> {
            profile = data;

            if (profile.length !==0){
              this.delrelativeArray[i].vendorname = profile[0].name;
             
            }
          },error=> {
            console.log(error)
          })
        }



        this.delrelativeArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });
      }
    },error=> {
      console.log(error)
    })


  }

  getAttachment(){

    this.attachmentService.findAll().subscribe(data=> {
      this.attachmentArray = data;

      if (this.attachmentArray.length !== 0){
        for (let i = 0; i<this.attachmentArray.length ;i++){

          var newDate = new Date (this.attachmentArray[i].date_Uploaded);
          let lateDate = this.datePipe.transform(newDate,'dd/MM/YYYY HH:mm');
          this.attachmentArray[i].date_Uploaded = lateDate;

          var profile = [];
          this.profileService.findByRid(this.attachmentArray[i].rid).subscribe(data=> {
            profile = data;

            if (profile.length !==0){
              this.attachmentArray[i].username = profile[0].name;
             
            }
          },error=> {
            console.log(error)
          })
        }


        this.attachmentArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });
      }
    },error=> {
      console.log(error)
    })



    //deleted attachment records

    
    this.delAttachmentService.findAll().subscribe(data=> {
      this.delattachmentArray = data;

      if (this.delattachmentArray.length !== 0){
        for (let i = 0; i<this.delattachmentArray.length ;i++){

          
          var newDate = new Date (this.delattachmentArray[i].date_Uploaded);
          let lateDate = this.datePipe.transform(newDate,'dd/MM/YYYY HH:mm');
          this.delattachmentArray[i].date_Uploaded = lateDate;

          var profile = [];
          this.delProfileService.findByRid(this.delattachmentArray[i].rid).subscribe(data=> {
            profile = data;

            if (profile.length !==0){
              this.delattachmentArray[i].username = profile[0].name;
             
            }
          },error=> {
            console.log(error)
          })
        }


        
        this.delattachmentArray.sort(function (a, b) {
          if (a.rid < b.rid) {
            return -1;
          }
          if (a.rid > b.rid) {
            return 1;
          }
          return 0;
        });
      }
    },error=> {
      console.log(error)
    })



  }

  closeModal(){
    this.location.back();

  }

}
