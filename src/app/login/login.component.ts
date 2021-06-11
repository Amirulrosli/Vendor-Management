import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthGuard } from '../auth.guard';
import { accountService } from '../services/account.service';
import { loginStateService } from '../services/loginState.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username: any;
  password: any;
  loginDate: Date;
  updateAccount: any;
  showMessage: boolean = false;

  constructor(
    private router: Router,
    private accountService: accountService,
    private userService: UserService,
    private loginState: loginStateService,
    private authGuard: AuthGuard
  ) { }

  ngOnInit(): void {
  }

  submit(){
    const username = this.username;
    const password = this.password;

    var account = {
      username: username,
      password: password
    }

    try{
      this.accountService.login(account).subscribe(resp=> {
        //(resp)

        var account = resp;

        this.accountService.findByid(account.id).subscribe(data=> {
          this.loginDate = new Date();
          this.updateAccount = data[0];
          this.updateAccount.last_Login = this.loginDate;
          // localStorage.setItem('rid',this.updateAccount.rid)

          sessionStorage.setItem('rid',this.updateAccount.rid);

          //(this.updateAccount)

          this.accountService.update(this.updateAccount.id,this.updateAccount).subscribe(data=> {
            //(data)

            //state
            var loginState = {
              id : this.updateAccount.id,
              rid : this.updateAccount.rid,
              login_state : true
            }

            this.loginState.update(this.updateAccount.id, loginState).subscribe(data => {
              //(data)
            })

          }, error=> {
            console.log(error)
          })

        }, error=> {
          console.log(error)
        })

        
        // localStorage.setItem("username",account.username);
        sessionStorage.setItem("username",account.username);

        sessionStorage.setItem("role",account.role);

        // localStorage.setItem("role",account.role)

        var user = {
          username: account.username,
          IC_Number: account.IC_Number,
          role: account.role,
          rid: account.rid,
          email: account.email

        }

        this.userService.setUser(user);
        this.showMessage = false;
        Swal.fire({
          title: 'You have successfully logged in',
          text: 'Welcome Back, '+account.username,
          imageUrl: 'assets/AISimple.png',
          imageHeight:280,
          imageWidth:350
        })
        // Swal.fire("You have successfully logged in",'Welcome Back,'+account.username,'success')
        this.router.navigate(['/dashboard'])
      }, error=> {
        Swal.fire("Login Failed","Invalid Username or password [1], Please check and try again",'error')
        this.showMessage = true;
        return;
      })
    } catch (error) {
      Swal.fire("Login Failed","Invalid Username or Password [2], Please check and try again",'error')
      this.showMessage = true;
      //(error)
      return;
    }

  }

}
