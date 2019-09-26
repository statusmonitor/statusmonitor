import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ErrorListService {

  private _url = "/kontaktcenteradministration/";
  private auth =  new Buffer('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
  env:string = localStorage.getItem("env");

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': "Basic " + this.auth
    })
  };

  constructor(private http: HttpClient) { }

  private messageSource = new Subject<PERIODICELEMENT_LIST[]>();
  messageTransfer = this.messageSource.asObservable();

  sendMessage(message:PERIODICELEMENT_LIST[]){
    this.messageSource.next(message);
  }

  clearMessage(){
    this.messageSource.next();
  }

  getMessage():Observable<PERIODICELEMENT_LIST[]>{
    return this.messageSource.asObservable();
  }

  
  private messageLog = new Subject<PERIODICELEMENT_LOG[]>();
  messageTransfer_log = this.messageSource.asObservable();
  sendMessage_log(message:PERIODICELEMENT_LOG[]){
    this.messageLog.next(message);
  }

  clearMessage_log(){
    this.messageLog.next();
  }

  getMessage_log():Observable<PERIODICELEMENT_LOG[]>{
    return this.messageLog.asObservable();
  }
  
  
  getErrorList(){
    const call ='Statusmonitor_getMuleErrorList';
    let env = localStorage.getItem('env').toLocaleLowerCase();
    let postSet = new HttpParams().set("env",env);
    return this.http.post<PERIODICELEMENT_LIST>(this._url + call,postSet,this.httpOptions);
  }

  getErrorTraceLog(id:string){
    const call ='traceLog';
    let env = localStorage.getItem('env').toLocaleLowerCase();
    let postSet = new HttpParams().set("env",env).set("traceid",id);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }
  
  loeschen(id:string){
    const call ='deleteOpenFunctionIssue';
    let postSet = new HttpParams().set("env",this.env).set("id",id);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }
  ablegen(id:string){
    const call ='unmarkOpenFunctionIssue';
    let postSet = new HttpParams().set("env",this.env).set("id",id);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }
  oeffnen(id:string){
    const call ='unmarkOpenFunctionIssue';
    let postSet = new HttpParams().set("env",this.env).set("id",id);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }
  uebernehmen(data:object){
    const call ='markOpenFunctionIssue';
    let postSet = new HttpParams().set("env",this.env);
    Object.keys(data).forEach(function (item) {  
      postSet = postSet.set(item, data[item]);
    });
    //this.postSet.set("id",id).set("user",user);    
    return this.http.post<PERIODICELEMENT_LIST>(this._url + call,postSet,this.httpOptions);
  }
  gefixt_tfsBug(data:object){
    const call ='markFixOpenFunctionIssue';
    let postSet = new HttpParams().set("env",this.env);
    Object.keys(data).forEach(function (item) {  
      this.postSet = this.postSet.set(item, data[item]);
    });
    return this.http.post<PERIODICELEMENT_LIST>(this._url + call,postSet,this.httpOptions);
  }
  gefixt(id:string){
    const call ='markTestOpenFunctionIssue';
    let postSet = new HttpParams().set("env",this.env).set("id",id);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }
  entkoppeln(id:string){
    const call ='Statusmonitor_unlinkTFS';
    let postSet = new HttpParams().set("env",this.env).set("id",id);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }
  erstellen(data:object){
    const call ='createTFSBug';
    let postSet = new HttpParams().set("env",this.env);
    Object.keys(data).forEach(function (item) {  
      postSet = postSet.set(item, data[item]);
    });
    return this.http.post<PERIODICELEMENT_LIST>(this._url + call,postSet,this.httpOptions);
  }
  verknpfen(data:object){
    const call ='Statusmonitor_linkTFS';
    let postSet = new HttpParams().set("env",this.env);

    Object.keys(data).forEach(function (item) {  
      postSet = postSet.set(item, data[item]);
    });

    return this.http.post<PERIODICELEMENT_LIST>(this._url + call,postSet,this.httpOptions);
  }
  
/**
 Löschen    else if($(this).hasClass('delete'))  deleteOpenFunctionIssue.php     "id": data[0],
  userselect
  Ablegen   else if($(this).hasClass('unmark'))  unmarkOpenFunctionIssue.php
  Öffnen    else if($(this).hasClass('unmark'))  unmarkOpenFunctionIssue.php
  Übernehmen if($(this).hasClass('mark'))        markOpenFunctionIssue.php       "userselect"
  Gefixt     else if($(this).hasClass('fix'))    // if(data[1] != null && data[1] !== "")// markFixOpenFunctionIssue.php //else// markTestOpenFunctionIssue.php
  TFS entkoppeln  else if ($(this).hasClass('unlinktfs'))  //if(window.confirm("Verlinkung zum TFS-Bug wirklich aufheben?"))// unlinkTFS.php
  TFS-Bug erstellen   else if($(this).hasClass('createtfs'))   createTFSBug.php
  TFS-Bug verknpfen     else if($(this).hasClass('linktfs'))  linkTFS.php

 */

  convertToJSON(head:string,array:Array<any>) {

    let displayedColumns_list = (head === "list") ? DISPLAYEDCOLUMNS_LISTS:DISPLAYEDCOLUMNS_LOGS;

    let newArray:Array<any> = [];
    newArray = [displayedColumns_list, ...array];

    let objArray = [];
    for (let i = 1; i < newArray.length; i++) {
      objArray[i - 1] = {};
      for (let k = 0; k < newArray[0].length && k < newArray[i].length; k++) {
        let key = newArray[0][k];
        objArray[i - 1][key] = newArray[i][k]
      }
    }
    return objArray;
  }
    

  createServicesList(param:PERIODICELEMENT_LIST[]):Array<SERVICES>{
    let service;
    let sw:boolean = false;
    let check:number;
    SERVICES_STATIC = [];
    
    for(let i=0; i<param.length;i++){

      if(SERVICES_STATIC === undefined || SERVICES_STATIC.length === 0){
        service = new SERVICES(param[i].Schnittstelle);
        service.serviceName = param[i].Schnittstelle;
        if(param[i].status === '1') service.inBarbeitung = 1;
        else if(param[i].status === '2') service.gefixt = 1;
        else service.offen = 1;
        
        SERVICES_STATIC.push(service);
      }else{
        for(let j=0; j<SERVICES_STATIC.length;j++){
          check = 0;
          if(SERVICES_STATIC[j].serviceName === param[i].Schnittstelle){
            if(param[i].status === '1') SERVICES_STATIC[j].inBarbeitung = 1;
            else if(param[i].status === '2') SERVICES_STATIC[j].gefixt = 1;
            else SERVICES_STATIC[j].offen = 1;
            check++;
            break;
          }
        }
        if(check === 0){
            service = new SERVICES(param[i].Schnittstelle);
            service.serviceName = param[i].Schnittstelle;
            if(param[i].status === '1') service.inBarbeitung = 1;
            else if(param[i].status === '2') service.gefixt = 1;
            else service.offen = 1;

            SERVICES_STATIC.push(service);
        }
      }
    }
    return SERVICES_STATIC;
  }

  setErrorListStatic(val:PERIODICELEMENT_LIST[]){
    ERRORLIST_STATIC = val;
  }
}
export let ERRORLIST_STATIC:PERIODICELEMENT_LIST[];
export let SERVICES_STATIC:Array<SERVICES> = [];


export interface PERIODICELEMENT_LIST {
  id:string;
  TFSBug: string;
  TraceID: string;
  Schnittstelle: string;
  Methode: string;
  BearbeitetVon: string;
  status: string;
  AnzahlFehler: string;
  LetzterFehler:string;
  createBy:string;
  critical:string;
}


export interface PERIODICELEMENT_LOG {
  TFSBug: string;
  TraceID: string;
  Schnittstelle: string;
  Methode: string;
  Sitzung: string;
  Parameter: string;
  ErrorCode: string;
  ErrorMessage:string;
  Result: string;
  Duration: string;
  Server: string;
  Debug: string;
  User: string;
  Kundenkennung:string;
}

export interface detailsElement {
  caller: string;
  dateEntered: string;
  debug: string;
  debugReadable: string;
  duration: string;
  durationDB: string;
  durationExternal: string;
  enddate:string;
  env: string;
  errorCode: string;
  id: string; 
  kundenkennung: string;
  loggerID: string;
  methode:string;
  params: string;
  result: Object;
  schnittstelle: string;
  server: string;
  sitzung: string;
  startdate: string;
  traceID: string;
  typ: string;
  userID: string;
  errorMessage: string;
}

export let DISPLAYEDCOLUMNS_LISTS: string[] = ['id','TFSBug', 'TraceID', 'Schnittstelle', 'Methode','BearbeitetVon', 'status', 'AnzahlFehler', 'LetzterFehler','createBy','critical'];
export let DISPLAYEDCOLUMNS_LOGS: string[] =  ['TFSBug', 'TraceID', 'Schnittstelle', 'Methode','Sitzung', 'Parameter', 'ErrorCode', 'ErrorMessage'
,'Result', 'Duration','Server', 'Debug', 'User', 'Kundenkennung'];


export class SERVICES {
  
  private _serviceName: string="";
  private _offen: number = 0;
  private _inBarbeitung: number = 0;
  private _gefixt: number = 0;
  
  constructor(name:string){
   this._serviceName = name;
  }
  set offen(val: number){
    this._offen += val;
  }
  set inBarbeitung(val: number){
    this._inBarbeitung += val;
  }
  set gefixt(val: number){
    this._gefixt += val;
  }
  set serviceName(val: string){
    this._serviceName = val;
  }
  get serviceName(){
    return this._serviceName;
  }
  get offen(){
    return this._offen;
  }
  get inBarbeitung(){
    return this._inBarbeitung;
  }
  get gefixt(){
    return this._gefixt;
  }

}
