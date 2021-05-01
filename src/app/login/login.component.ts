import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { accountService } from '../services/account.service';
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
    private userService: UserService
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
        console.log(resp)

        var account = resp;

        this.accountService.findByid(account.id).subscribe(data=> {
          this.loginDate = new Date();
          this.updateAccount = data[0];
          this.updateAccount.last_Login = this.loginDate;
          console.log(this.updateAccount)

          this.accountService.update(this.updateAccount.id,this.updateAccount).subscribe(data=> {
            console.log(data)
          }, error=> {
            console.log(error)
          })

        }, error=> {
          console.log(error)
        })

        
        localStorage.setItem("username",account.username);
        localStorage.setItem("role",account.role)

        var user = {
          username: account.username,
          IC_Number: account.IC_Number,
          role: account.role,
          rid: account.rid,
          email: account.email

        }

        this.userService.setUser(user);
        this.showMessage = false;
        Swal.fire("Successful login","Welcome back, "+account.username,'success')
        this.router.navigate(['/dashboard'])
      }, error=> {
        Swal.fire("Login Failed","Invalid Username or password, Please check and try again",'error')
        console.log(error)
        this.showMessage = true;
        return;
      })
    } catch (error) {
      Swal.fire("Login Failed","Invalid Username or Password, Please check and try again",'error')
      this.showMessage = true;
      console.log(error)
      return;
    }

  }

}
