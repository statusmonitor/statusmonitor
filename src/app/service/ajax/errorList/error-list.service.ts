import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Observable,Subject } from 'rxjs';
import { UserService } from '../../users/user.service';
import { AppConfig } from 'app.config';
import { NotificationService } from '../../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})

export class ErrorListService {

  private _url = "/kontaktcenteradministration/";
  private auth =  new Buffer('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
  env:string = AppConfig.settings.env.name;
  

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': "Basic " + this.auth
    })
  };

  constructor(
    private notification:NotificationService,
    private http: HttpClient) {
      this.notification.requestPermisson();
    }

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
    

  createServicesList(param:PERIODICELEMENT_LIST[]):Array<Services>{
    let service:Services;
    let check:number;
    SERVICES_STATIC = [];
    
    for(let i=0; i<param.length;i++){
      if(this.isBlank(SERVICES_STATIC)){

        service = this.setService(param[i]);
        SERVICES_STATIC.push(service);

      }else{
        for(let j=0; j<SERVICES_STATIC.length;j++){
          check = 0;

          if(this.searchSameElement(SERVICES_STATIC[j].serviceName, param[i].Schnittstelle)){
            this.setServiceStatus(param[i],SERVICES_STATIC[j]);

            check++;
            break;
          }
        }
        if(check === 0){
          service = this.setService(param[i]);
          SERVICES_STATIC.push(service);
        }
      }
    }

    return SERVICES_STATIC;
  }


  setService(param:PERIODICELEMENT_LIST){
    
    let el:Services = new Services(param.Schnittstelle);
    el.serviceName = param.Schnittstelle;

    return this.setServiceStatus(param,el);
  }
  
  setServiceStatus(param:PERIODICELEMENT_LIST,el:Services):Services{
    if(param.status === '1') el.inBarbeitung = 1;
    else if(param.status === '2') el.gefixt = 1;
    else if(param.status === '-1') {
      this.showNotification(param.Schnittstelle,param.TraceID);
    }
    else el.offen = 1;
    return el;
  }

  searchSameElement(a:string,b:string):boolean{
    if(a === b){return true;}
    return false;
  }


  isBlank(arr:Array<Services>):boolean{
    if(arr === undefined || arr.length === 0){
      return true;
    }
    return false;
  }

  showNotification(schnittstelle:string, traceID:string){

    let data: Array < any > = [];
    data.push({
        'title': 'Neuer Fehler',
        'alertContent': `"Fehler in ${schnittstelle}:   Klick f&uuml;r Stacktrace. ${traceID}`,
        'traceID':traceID,
        'env':this.env
    });

    this.notification.generateNotification(data);
   }

  setErrorListStatic(val:PERIODICELEMENT_LIST[]){
    ERRORLIST_STATIC = val;
  }

}

export let ERRORLIST_STATIC:PERIODICELEMENT_LIST[];
export let SERVICES_STATIC:Array<Services> = [];
export let DISPLAYEDCOLUMNS_LISTS: string[] = ['id','TFSBug', 'TraceID', 'Schnittstelle', 'Methode','BearbeitetVon', 'status', 'AnzahlFehler', 'LetzterFehler','createBy','critical'];
export let DISPLAYEDCOLUMNS_LOGS: string[] =  ['TFSBug', 'TraceID', 'Schnittstelle', 'Methode','Sitzung', 'Parameter', 'ErrorCode', 'ErrorMessage'
,'Result', 'Duration','Server', 'Debug', 'User', 'Kundenkennung'];

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


export class Services {
  
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
