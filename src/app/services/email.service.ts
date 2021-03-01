import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const baseURL="http://localhost:3000/api/email"

@Injectable({
    providedIn: 'root'
})

export class emailService {
    constructor( private http : HttpClient){}

    create(data): Observable<any> {
        console.log(data)
        return this.http.post(baseURL,data)
    }
}
