import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AppConfig } from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class WebloginService {
  constructor() { }

  weblogin(){
    window.location.href = AppConfig.settings.weblogin.url;
  }

  setLocal(local:boolean){
    sessionStorage.setItem('isLocal',String(local)); 
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
    let tmp:string = env;
    localStorage.setItem("env",tmp.toLowerCase());
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
