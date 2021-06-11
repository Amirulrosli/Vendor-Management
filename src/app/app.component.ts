import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  mySubscription: any;
  constructor(private swPush: SwPush, 
    private notification: notificationService,
    private slidePanel: MatSlidePanel,
    private router: Router
    ){

      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.mySubscription = this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
           // Trick the Router into believing it's last link wasn't previously loaded
           this.router.navigated = false;
        }
      }); 
    }

    ngOnDestroy(){
      if (this.mySubscription) {
        this.mySubscription.unsubscribe();
      }
    }

  ngOnInit(){

    this.pushSubscription();
    

  }


  // successNotification(){
  //   Swal.fire('Hi', 'We have been informed!', 'success')
  // }


  pushSubscription(){
    if (!this.swPush.isEnabled){

      //('Notification is not enabled')
      return;
    }

    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey
    }).then(sub => {
      //(JSON.stringify(sub))
    }).catch(err=> {
      console.log(err)
    })

  }

  public notifyNumber(){
    this.notification.findByView().subscribe(data=> {
        this.notifyData = data;
        //(this.notifyData)
        return this.notifyData.length;
    })
  }

  openNotification(){
    this.slidePanel.open(NotificationComponent, {
      slideFrom:'right'
    })
  }
  

  }
