import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { recibo } from '../components/interface/recibos';

@Injectable({
  providedIn: 'root'
})
export class ApiCoreService {

  constructor(private http: HttpClient) { }

  //https://localhost:7237
  url = "https://localhost:7237/api/"
  getQuery( query: string ) {
    const url = `${this.url}${ query }`;
    return this.http.get<recibo[]>(url);
  }

  putQuery( query: string, info: {} , extra?:{}) {
    const url = `${this.url}${ query }`;
    return this.http.put(url,info)
  }

  postQuery( query: string, info: {} ) {
    const url = `${this.url}${ query }`;
    return this.http.post(url,info);
  }

  postQueryUser( query: string, info: {},extra?:{}) {
    const url = `${this.url}${ query }`;
    return this.http.post(url,info,extra);
  }

  deleteQuery( query: string ) {
    const url = `${this.url}${ query }`;
    return this.http.delete(url);
  }



  putLogin(info:{}){
    return this.putQuery('Users',info)
  }
  postUser(info:{}){
    //{responseType: 'text'}
    return this.postQueryUser('Users',info,{responseType: 'text'})
  }

  getUser(id:string) {
    return this.getQuery(`Users/${id}`)
              .pipe( map( data => data ));
  }

  getRecibos(id:string) {
    return this.getQuery(`Recibos/${id}`)
              .pipe( map( data => data ));
  }

  postRecibo(info:{}){
    return this.postQuery("Recibos",info)
  }

  putRecibo(info:{}){
    return this.putQuery("Recibos",info)
  }

  deleteRecibo(id:string){
    return this.deleteQuery(`Recibos/${id}`)
  }

}
