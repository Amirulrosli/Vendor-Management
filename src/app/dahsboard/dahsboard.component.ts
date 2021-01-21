import { isEmptyExpression } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Profile } from '../services/Profile.model';
import { profileService } from '../services/profile.service';

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

  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  listData: MatTableDataSource<any>;

  displayedColumns: string[] = [
  
    'IC_Number',
    'name',
    'email',
    'phone',
    'latest_Payment',
    'overdue',
    'actions',
  
  ];
  
  constructor(
    private router: Router,
    private profiles: profileService
  ) { 

    this.close = false;
  }

  ngOnInit(): void {

    this.profiles.findAll().subscribe(array=> {
      this.retrieveData = array
      this.retrieveDataLength = this.retrieveData.length;
      console.log(this.retrieveDataLength)
      console.log(array)
      this.list = array.map(item=> {
        console.log(item)
        return{
          id: item.id,
          ...item as Profile
        }
      });

      this.listData = new MatTableDataSource(this.list);
      this.listData.sort = this.sort;
      this.listData.paginator = this.paginator;


    })



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

  onDelete(id){
    console.log(id)

    this.profiles.delete(id).subscribe(resp=> {
      console.log(resp)
      this.ngOnInit()
      
    },err=> {
      console.log(err)
    })
  }



}