import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { rejects } from 'assert';
import { Observable } from 'rxjs';
import { promise } from 'selenium-webdriver';
import { loginStateService } from './services/loginState.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  username: any;
  rid: any;
  retrieveData: any = [];
  loginState: any;

  

  constructor(
    private router: Router,
    private login: loginStateService,
    private route: ActivatedRoute,

  ){

    

    // const compId = this.route.snapshot.paramMap.get('rid')
    // this.login.findAll().subscribe(data=> {
    //   this.retrieveData = data
    //   this.rid = this.retrieveData[0].rid
    //   console.log(this.retrieveData)
    // })
    // this.rid = compId
  }


  
     

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // console.log(this.loginState)

      

      return new Promise ((resolve, rejects) =>{
        setTimeout(() =>{
        this.rid = sessionStorage.getItem("rid")
        //(this.rid)
        this.login.findByRid(this.rid).subscribe(data=> {
          
          this.retrieveData = data
          this.rid = data.rid
          //(data)
          try {

            this.loginState = this.retrieveData[0].login_state
            //(this.loginState)
            if (this.loginState == true) {
              resolve(true);
            }
    
            //ani luan laju read this code.
            else {
              //('User Logged Out');
                this.router.navigate(['/login']);
                rejects('logged out')
            }

          } catch (error) {

            //('User Logged Out');
            this.router.navigate(['/login']);
            rejects('logged out')
            return;

          }
   

          
      
    
        },error=> {
          //('User Logged Out');
          this.router.navigate(['/login']);
          rejects('logged out')
        });

    


        
        }, 500)

      
      })    
   
  }
  
}
