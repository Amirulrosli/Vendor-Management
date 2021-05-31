import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

const baseURL=environment.apiURL+"/api/email"

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
