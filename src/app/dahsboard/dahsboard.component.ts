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
import { Profile } from '../services/Profile.model';
import { profileService } from '../services/profile.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { notificationService } from '../services/notification.service';
import { ChangeDetectorRef } from '@angular/core';
// import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-dahsboard',
  templateUrl: './dahsboard.component.html',
  styleUrls: ['./dahsboard.component.scss']
})
export class DahsboardComponent implements OnInit {
  close: any;
  opened = true
  retrieveData:any;
  retrieveDataLength:any;
  list:Profile[];
  searchKey: any;
  notifyNo: any;
  notifyData:any;
  overDueData: any;
  paidData: any;

  overdue:any;
  dateToday;
  today;
  paymentDue;
  overdueDays;
  overdueBoolean: boolean;
  dueTrue: true;
  selectField: string = "All"

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
  
  constructor(
    private router: Router,
    private profiles: profileService,
    private dialog: MatDialog,
    private slidePanel: MatSlidePanel,
    private datePipe: DatePipe,
    private notification: notificationService,
    private changeDetectorRefs: ChangeDetectorRef

  ) { 

    this.close = false;
  }



  ngOnInit(): void {


    this.notifyNumber();
    this.refreshData();

  }


  parseDate(str){
        var mdy = str.split('/');
        return new Date(mdy[2], mdy[0]-1, mdy[1]);
  }

  goToDashboard(){
    console.log("hantu")
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
          title: 'Account Deletion'+' '+data.name, 
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

        this.profiles.delete(data.id).subscribe(resp=> {

         

          Swal.fire(
            'Removed!',
            'Vendor Profile removed successfully.',
            'success'
          )
          this.refreshData();
          this.notifyNumber();
          
        },err=> {
          console.log(err)
        });


      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Vendor Profile is still in our database.)',
          'error'
        )
      }
    });

  }

  viewing(id){
    this.router.navigate(["vendor-profile/"+id])
    console.log(id)
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
      });
    }, error=> {
      console.log(error)
    });

    

  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        this.notifyNo = this.notifyData.length;
    })
  }


  refreshData(){

    console.log(this.notification.notifyData);
    this.profiles.findAll().subscribe(array=> {
      this.retrieveData = array
      this.retrieveDataLength = this.retrieveData.length;
      console.log(this.retrieveDataLength)
      console.log(array)
      this.list = array.map(item=> {
       
        return{
          id: item.id,
          ...item as Profile
        }
      });

      this.loopData();

      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;
      this.changeDetectorRefs.detectChanges();

    })

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
        this.list[i].overdue = this.overdueBoolean
        
        console.log(this.overdueBoolean)


        //update latest payment
        this.profiles.update(this.list[i].id,this.list[i]).subscribe(array =>{
          console.log(array);
        },error => {
          console.log(error)
        })

      }
      

      //write overdue to true
      
    }
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


  onChange(value) {
    switch (value){
      case "All": {
        this.refreshData();
        break;
      }

      case "Overdue": {

        this.retrieveOverdue();
        break;

      }

      case "Paid": {
        this.retrievePaid();
        break;
      }
    }
  }



}
