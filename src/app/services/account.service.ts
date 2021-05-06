import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const baseURL="http://localhost:3000/api/account"


@Injectable({
    providedIn: 'root'
})

export class accountService {

    constructor( private http : HttpClient){}

    findAll(): Observable<any> {
        return this.http.get(baseURL)
    }

    createAccount(data): Observable<any> {
        console.log(data)
        return this.http.post(baseURL,data)
    }

    login(data): Observable<any> {
        console.log(data)
        return this.http.post(`${baseURL}/login`,data)
    }

    update(id,data): Observable<any> {
        return this.http.put(`${baseURL}/id/${id}`,data)
    }

    deleteAll(): Observable<any>{
        return this.http.delete(baseURL);
    }

    delete(id): Observable<any> {
        return this.http.delete(`${baseURL}/${id}`);
    }

    findByid(id): Observable<any> {
        return this.http.get(`${baseURL}/${id}`)
    }

    findByUsername(username): Observable<any> {
        return this.http.get(`${baseURL}/username/${username}`)
    }
    findByIC(IC_Number): Observable <any> {
        return this.http.get(`${baseURL}/IC_Number/${IC_Number}`)
    }

}