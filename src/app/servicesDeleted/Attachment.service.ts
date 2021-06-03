import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment';

const baseURL=environment.apiURL+"/api/delattachment"
const base = environment.apiURL;

@Injectable({
    providedIn: 'root'
})

export class DelattachmentService {

    constructor( private http : HttpClient){}

    baseURL(){
        return environment.apiURL;
    }

    findAll(): Observable<any> {
        return this.http.get(baseURL)
    }

    uploadFile(formData): Observable<any> {
        return this.http.post(`${base}/uploadfile`, formData)
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

    findByid(id): Observable<any> {
        return this.http.get(`${baseURL}/id/${id}`)
    }
    findByVendorid(vendor_rid): Observable<any> {
        return this.http.get(`${baseURL}/vendor_rid/${vendor_rid}`)
    }

}