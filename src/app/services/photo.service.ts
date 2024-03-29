import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment';

const baseURL=environment.apiURL+"/api/photo"
const base = environment.apiURL


@Injectable({
    providedIn: 'root'
})

export class photoService {

    public notifyData:any;
    constructor( private http : HttpClient){}


    baseURL(){
        return environment.apiURL;
    }

    findAll(): Observable<any> {
        return this.http.get(baseURL)
    }
    findOne(id): Observable <any> {
        return this.http.get(`${baseURL}/id/${id}`)
    }

    upload(form): Observable<any> {
        console.log(form)
        return this.http.post(`${base}/photo/uploadfile`, form)
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

    findByRid(rid): Observable<any> {
        return this.http.get(`${baseURL}/rid/${rid}`)
    }

    create(data): Observable<any> {
        console.log(data)
        return this.http.post(baseURL,data)
    }

    


}