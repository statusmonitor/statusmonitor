import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebloginService {


  constructor(
    private http: HttpClient
    ) { }
  private _url = "http://linux-entwicklung.sw.buhl-data.com:3001/user/";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };

  weblogin(){
    window.location.href = 'http://weblogin.sw.buhl-data.com/v0/login/61';
  }
  isLogined():boolean{
    return !! localStorage.getItem('session');
  }
  setSessionID(session:string):void{
    localStorage.setItem("session",session);
  }
  getSessionID():string{
    return localStorage.getItem("session");
  }
  setUser(user:string):void{
    localStorage.setItem("user",user);
  }
  getUser():string{
    return localStorage.getItem("user");
  }

  setEnv(env){
    localStorage.setItem("env",env);
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
  checkAuth():any{
    const call ='checkAuth';
    return this.http.get(this._url + call,this.httpOptions);
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
