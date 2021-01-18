import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const baseURL="http://localhost:3000/api/profiles"

@Injectable({
    providedIn: 'root'
})

export class profileService {
    constructor( private http : HttpClient){}

    getAll(): Observable<any> {
        return this.http.get(baseURL)
    }
    get(id): Observable <any> {
        return this.http.get(`${baseURL}/${id}`)
    }

    create(data): Observable<any> {
        console.log(data)
        return this.http.post(baseURL,data)
    }

    update(id,data): Observable<any> {
        return this.http.post(`${baseURL}/${id}`,data)
    }

    deleteAll(): Observable<any>{
        return this.http.delete(baseURL);
    }

    delete(id): Observable<any> {
        return this.http.delete(`${baseURL}/${id}`);
    }

    findByIC(IC): Observable<any> {
        return this.http.get(`${baseURL}?IC_Number=${IC}`)
    }
}