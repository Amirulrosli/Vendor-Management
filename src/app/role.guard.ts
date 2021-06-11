import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { promise } from 'selenium-webdriver';
import { loginStateService } from './services/loginState.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  accountRole: any;
  rid: any;

  constructor(
    private router: Router,
    private login: loginStateService,
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    

      return new Promise ((resolve, rejects) => {
        setTimeout(() =>{
          this.accountRole = sessionStorage.getItem("role")
          
          if (this.accountRole == "Administrator") {
            //("accepted")
            resolve(true)
          }

          if (this.accountRole == "Staff") {
            //("accepted")
            resolve(true)
          }

          if (this.accountRole == "View-only"){
            //('view-only user. No Access')
            this.router.navigate(['/dashboard']);
            rejects('no access')
          }          
          
          // else{
          //   console.log("no access")
          //   this.router.navigate(['/dashboard']);
          //   rejects('no access')
          // }

        }, 500)

      })


      
  }
  
}
