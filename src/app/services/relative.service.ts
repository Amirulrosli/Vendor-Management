import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

const baseURL=environment.apiURL+"/api/relative"


@Injectable({
    providedIn: 'root'
})

export class relativeService {

    constructor( private http : HttpClient){}

    findAll(): Observable<any> {
        return this.http.get(baseURL)
    }

    createRelative(data): Observable<any> {
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

    findByrid(rid): Observable<any> {
        return this.http.get(`${baseURL}/${rid}`)
    }

    findByIC(IC_Number): Observable<any> {
        return this.http.get(`${baseURL}/IC/${IC_Number}`)
    }

    findSpouseOnly():Observable<any> {
        return this.http.get(`${baseURL}/spouse/spouse`)
    }
    findChildOnly():Observable<any> {
        return this.http.get(`${baseURL}/child/child`)
    }

}