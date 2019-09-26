import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Subject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class MuleChartService {

  private _url = "/kontaktcenteradministration/";
  private auth =  new Buffer('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
  private env = "test";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': "Basic " + this.auth
    })
  };

  constructor(private http: HttpClient) { }
  private messageSource = new Subject<muleStateElement>();
  messageTransfer = this.messageSource.asObservable();
  sendMessage(message:muleStateElement){
    this.messageSource.next(message);
  }

  clearMessage(){
    this.messageSource.next();
  }

  getMessage():Observable<muleStateElement>{
    return this.messageSource.asObservable();
  }

  getmyState(){
    let call = 'Statusmonitor_getMyState';
    return this.http.post<any>(this._url + call,"",this.httpOptions);
  }

  getmyoldState(von:string,bis:string){
    let call = 'Statusmonitor_getCpuUsage';
    let postSet = new HttpParams().set("env",this.env).set("von",von).set("bis",bis);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }

}
export interface muleStateElement{
  freeram: string,
  ramint: number,
  usedram: string,
  freeramint:number,
  cpuUsageDouble:number,
  cpuUsageStr:string,
  totalram:string
}
