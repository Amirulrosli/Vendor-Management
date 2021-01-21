import { Component } from '@angular/core';
// import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vendorManagement';
  opened = true;


  // successNotification(){
  //   Swal.fire('Hi', 'We have been informed!', 'success')
  // }

}
