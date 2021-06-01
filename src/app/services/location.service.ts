import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

const baseURL=environment.apiURL+"/api/location"

@Injectable({
    providedIn: 'root'
})

export class locationService {
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
        return this.http.put(`${baseURL}/id/${id}`,data)
    }

    deleteAll(): Observable<any>{
        return this.http.delete(baseURL);
    }

    delete(id): Observable<any> {
        return this.http.delete(`${baseURL}/${id}`);
    }

    findByLocation(location): Observable<any> {
        return this.http.get(`${baseURL}/location/${location}`)
    }

    
}