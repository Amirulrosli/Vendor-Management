import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { MatSlidePanel } from 'ngx-mat-slide-panel';
import { NotificationComponent } from './notification/notification.component';
import { notificationService } from './services/notification.service';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vendorManagement';
  opened = true;
  private readonly publicKey = 'BGYsR3C0xWYaSS6tswNBz4mfFzVUzhjnfQWBD1zbaSqJlM8rRlcP2NVNM0bAJpZ-mUj_5LrAmEEai7UMII5xYZk';
  notifyData: any;
  constructor(private swPush: SwPush, 
    private notification: notificationService,
    private slidePanel: MatSlidePanel){}


  ngOnInit(){

    this.pushSubscription();
    

  }


  // successNotification(){
  //   Swal.fire('Hi', 'We have been informed!', 'success')
  // }


  pushSubscription(){
    if (!this.swPush.isEnabled){

      console.log('Notification is not enabled')
      return;
    }

    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey
    }).then(sub => {
      console.log(JSON.stringify(sub))
    }).catch(err=> {
      console.log(err)
    })

  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        console.log(this.notifyData)
        return this.notifyData.length;
    })
  }

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    })
  }
  

  }
