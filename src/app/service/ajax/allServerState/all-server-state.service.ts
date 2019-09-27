import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Buffer } from 'buffer';
import * as moment from 'moment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllServerStateService {

  private _url = "/kontaktcenteradministration/Statusmonitor_getAllServerStatus";
  private auth =  new Buffer('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': "Basic " + this.auth
    })
  };

  constructor(private http: HttpClient) { }

  getAllState(){
    return this.http.post<allServerStateElement>(this._url,"",this.httpOptions);
  }
  changeToClassData(data:allServerStateElement):AllServer[]{

    let server:any;
    let now:string =  moment().format('L') + " " + moment().format('LTS');
    let servers:AllServer[] = [];

    for(let key in data){
      let state:boolean = data[key].status.state;
      let name:string = key.toUpperCase();
      server = new AllServer(key);

      if(key === 'omikron'){
        server.name = name;
        server.state = true;
        server.DQ1 = data[key].status.state_DQServer_1;
        if(!server.DQ1){server.eDate1 = now; server.state = server.DQ1;}
        server.DQ2 = data[key].status.state_DQServer_2;
        if(!server.DQ2){server.eDate2 = now; server.state = server.DQ2;}
        server.SR = data[key].status.state_SearchRecords;
        if(!server.SR){server.eDateS = now; server.state = server.SR;}
        
      }else{
        server.state = state;
        server.name = name;
        if(!state){
          server.eDate = now;
        }
      }
      servers.push(server);
    }
    return  servers;
  }

  private messageSource = new Subject<allServerStateElement>();
  messageTransfer = this.messageSource.asObservable();
  sendMessage(message:allServerStateElement){
    this.messageSource.next(message);
  }
  clearMessage(){
    this.messageSource.next();
  }
  getMessage():Observable<allServerStateElement>{
    return this.messageSource.asObservable();
  }
  
}

export interface allServerStateElement {
  mule:{status:{state:boolean}};
  ticketSystem:{status:{state:boolean}};
  mysql:{status:{state:boolean}};
  finanz:{status:{state:boolean}};
  membership:{status:{state:boolean}};

  omikron:{
    status:{
      state_DQServer_1:boolean,
      state_DQServer_2:boolean,
      state_SearchRecords:boolean
    }
    stateFromXML:{
      state_DQServer_1:boolean,
      state_DQServer_2:boolean
    }
  }
}

export class AllServer{
  private _name:string;
  private _state:boolean;
  private _DQ1:boolean;
  private _DQ2:boolean;
  private _SR:boolean;

  private _eDate:string;
  private _eDate1:string;
  private _eDate2:string;
  private _eDateS:string;

  constructor(_name:string){this._name = name;} 

  set name(name:string){this._name = name;}
  set state(state:boolean){this._state = state;}

  get name(){return this._name};
  get state(){return this._state};

  set eDate(eDate:string){this._eDate = eDate;}
  get eDate(){return this._eDate};

  set DQ1(state_DQServer_1:boolean){this._DQ1 = state_DQServer_1;}
  get DQ1(){return this._DQ1};
 
  set DQ2(state_DQServer_2:boolean){this._DQ2 = state_DQServer_2;}
  get DQ2(){return this._DQ2};
 
  set SR(state_SearchRecords:boolean){this._SR = state_SearchRecords;}
  get SR(){return this._SR};

  set eDate1(eDate1:string){this._eDate1 = eDate1;}
  get eDate1(){return this._eDate1};

  set eDate2(eDate2:string){this._eDate2 = eDate2;}
  get eDate2(){return this._eDate2};

  set eDateS(eDateS:string){this._eDateS = eDateS;}
  get eDateS(){return this._eDateS};
}
