
  
import { Injectable } from '@angular/core'
import { first } from 'rxjs/operators'


interface user {
    username: string
    rid: string
    email: string
    IC_Number: string
    role: string

}


@Injectable()
export class UserService {
    private user: user


    constructor(){}


    setUser(user: user){
        this.user = user
    }

    getUsername(): string{
        return  this.user.username;
    }

    getEmail(): string {
        return this.user.email;
    }


   async isAuthenticated(){
        
    }

    getRID(): string{
        
        return this.user.rid;
    }

    getICNumber(): string {
        return this.user.IC_Number;
    }
    getRole(): string {
        return this.user.role;
    }


}
