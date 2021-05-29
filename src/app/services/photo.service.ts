import {Injectable} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const baseURL="http://localhost:3000/api/photo"


@Injectable({
    providedIn: 'root'
})

export class photoService {

    public notifyData:any;
    constructor( private http : HttpClient){}


    baseURL(){
        return "http://localhost:3000";
    }

    findAll(): Observable<any> {
        return this.http.get(baseURL)
    }
    findOne(id): Observable <any> {
        return this.http.get(`${baseURL}/id/${id}`)
    }

    upload(form): Observable<any> {
        console.log(form)
        return this.http.post('http://localhost:3000/photo/uploadfile', form)
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