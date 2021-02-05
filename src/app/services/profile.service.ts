import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const baseURL="http://localhost:3000/api/profiles"

@Injectable({
    providedIn: 'root'
})

export class profileService {
    constructor( private http : HttpClient){}

    findAll(): Observable<any> {
        return this.http.get(baseURL)
    }
    findOne(id): Observable <any> {
        return this.http.get(`${baseURL}/${id}`)
    }

    create(data): Observable<any> {
        console.log(data)
        return this.http.post(baseURL,data)
    }

    update(id,data): Observable<any> {
        return this.http.put(`${baseURL}/update/${id}`,data)
    }

    deleteAll(): Observable<any>{
        return this.http.delete(baseURL);
    }

    delete(id): Observable<any> {
        return this.http.delete(`${baseURL}/${id}`);
    }

    findByIC(IC): Observable<any> {
        return this.http.get(`${baseURL}/IC/${IC}`)
    }

    updateLatestPayment(id, data): Observable<any> {
        return this.http.put(`${baseURL}/${id}`,data)
    }

    findByRid(rid): Observable<any> {
        return this.http.get(`${baseURL}/rid/${rid}`)
    }

    findAllOverdue(): Observable<any> {
        return this.http.get(`${baseURL}/overdue`)
    }

    findAllPaid(): Observable<any> {
        return this.http.get(`${baseURL}/paid`)
    }
    
}