import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }
  private _url = "http://linux-entwicklung.sw.buhl-data.com:3001/user/";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };

  tocken(id,env){
    const call ='login/'+id;
    this.setEnv(env);
    return this.http.get(this._url + call,this.httpOptions);
  }

  setEnv(env){
    sessionStorage.setItem("env",env);
  }

  removeToken(): void {
    localStorage.removeItem("token");
  }

  setToken(token: string): void {
    sessionStorage.setItem("token",token);
  }

  getToken(): string {
    return sessionStorage.getItem("token");
  }

  private messageSource = new Subject<boolean>();
  messageTransfer = this.messageSource.asObservable();

  sendMessage(message:boolean){
    this.messageSource.next(message);
  }

  clearMessage(){
    this.messageSource.next();
  }

  getMessage():Observable<boolean>{
    return this.messageSource.asObservable();
  }

}
