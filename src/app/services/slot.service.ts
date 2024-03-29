import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'

const baseURL=environment.apiURL+"/api/slots"

@Injectable({
    providedIn: 'root'
})

export class slotService {
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

    deletebyRid(rid): Observable<any>{
        return this.http.delete(`${baseURL}/rid/${rid}`)
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

    findBySlot(slot_Number): Observable<any> {
        return this.http.get(`${baseURL}/slot/${slot_Number}`)
    }

    findByLocation(location): Observable<any> {
        return this.http.get(`${baseURL}/location/${location}`)
    }


    findbytaken(taken): Observable<any>{
        console.log(taken)
        return this.http.get(`${baseURL}/taken/${taken}`)
    }

    findbyAvailable(available): Observable<any> {
        return this.http.get(`${baseURL}/available/${available}`)
    }
    
    
}