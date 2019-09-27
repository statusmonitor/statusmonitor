import { Component,OnInit } from '@angular/core';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';
import { allServerStateElement } from './service/ajax/allServerState/all-server-state.service';
import { ErrorListService,ERRORLIST_STATIC,PERIODICELEMENT_LIST,PERIODICELEMENT_LOG } from './service/ajax/errorList/error-list.service';
import { MuleChartService,muleStateElement } from './service/muleChart/mule-chart.service';
import { WebloginService } from './guard/weblogin/weblogin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title:string = 'statusmonitor';
  env:string;
  checkUser:boolean = true;
  allServerStateData:allServerStateElement;
  muleState:muleStateElement;
  tabledata:PERIODICELEMENT_LIST[];
  tabledataLog:PERIODICELEMENT_LOG[];

  constructor(
    private socket:SocketIOService,
    private errorListService:ErrorListService,
    private authService:WebloginService,
    private muleChartService:MuleChartService) {}

   ngOnInit() {
    this.socket.listenSocket('callErrorList').subscribe(
      (res)=>{this.getErrorList(res);});
      this.socket.listenSocket('callAllServerState').subscribe(
      (res)=>{this.getAllServer(res);});
      this.socket.listenSocket('CallMuleState').subscribe(
      (res)=>{this.getMuleState(res);});

    this.authService.getMessage().subscribe(
      (message)=>{
        this.checkUser = message;
        this.authCheck();
      });

   }

   authCheck(){
    if(!this.checkUser){
      console.error("401 : Die Anfrage kann nicht ohne gültige Authentifizierung durchgeführt werden.");
     }else{
      this.socket.initSocket();
     }
  }

  getAllServer(data){    
    this.allServerStateData = JSON.parse(data)["callAllServerState&"];
  }
  
  getErrorList(data){
    let d = JSON.parse(data);
    let tmp:any = JSON.parse(data)["callErrorList&"].mule.errorList.data;
    let tmpLog:any = JSON.parse(data)["callErrorList&"].mule.errorLog.data;
    this.tabledata =  this.errorListService.convertToJSON("list",tmp);
    this.tabledataLog =  this.errorListService.convertToJSON("",tmpLog);
    this.errorListService.setErrorListStatic(this.tabledata);
    this.errorListService.sendMessage(this.tabledata);
    this.errorListService.sendMessage_log(this.tabledataLog);
    this.errorListService.createServicesList(ERRORLIST_STATIC);
  }

  getMuleState(data){
    this.muleState = JSON.parse(data)["CallMuleState&"];
    this.muleChartService.sendMessage(this.muleState);
  }

}
