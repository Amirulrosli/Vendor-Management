import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

const baseURL=environment.apiURL+"/api/payments"

@Injectable({
    providedIn: 'root'
})

export class paymentService {
    constructor( private http : HttpClient){}

    findAll(): Observable<any> {
        return this.http.get(baseURL)
    }
    findOne(rid): Observable <any> {
        return this.http.get(`${baseURL}/${rid}`)
    }

    create(data): Observable<any> {
        console.log(data)
        return this.http.post(baseURL,data)
    }

    update(id,data): Observable<any> {
        return this.http.put(`${baseURL}/${id}`,data)
    }

    deleteAll(): Observable<any>{
        return this.http.delete(baseURL);
    }

    delete(id): Observable<any> {
        return this.http.delete(`${baseURL}/${id}`);
    }

    findByRid(rid): Observable<any> {
        return this.http.get(`${baseURL}/rid/${rid}`)
    }

    findByPaymentID(paymentID): Observable<any> {
        console.log(paymentID)
        return this.http.get(`${baseURL}/payment/${paymentID}`)
    }

    findSent(): Observable<any> {
        return this.http.get(`${baseURL}/sent/sent`)
    }

    findNotDelivered(): Observable<any> {
        return this.http.get(`${baseURL}/deliver/deliver`)
    }

    
}