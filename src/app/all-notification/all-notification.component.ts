import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-notification',
  templateUrl: './all-notification.component.html',
  styleUrls: ['./all-notification.component.scss']
})
export class AllNotificationComponent implements OnInit {

  close = true
  opened: any;

  constructor(private location: Location) {

    this.opened = false;

   }

  ngOnInit(): void {
  }

  closeNav(){
    this.opened = true;
  }

  openNav(){
    this.opened = false;
  }

  back(){
    this.location.back();
  }


}
