import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const baseURL="http://localhost:3000/api/loginState"

@Injectable({
    providedIn: 'root'
})

export class loginStateService {
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

    findOnline(): Observable<any> {
        return this.http.get(`${baseURL}/user/online`)
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

    deletebyRid(rid): Observable<any>{
        return this.http.delete(`${baseURL}/rid/${rid}`)
    }

    findByRid(rid): Observable<any> {
        return this.http.get(`${baseURL}/rid/${rid}`)
    }
    
    
}