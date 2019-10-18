import { Component,OnInit } from '@angular/core';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';
import { allServerStateElement } from './service/ajax/allServerState/all-server-state.service';
import { ErrorListService,ERRORLIST_STATIC,PERIODICELEMENT_LIST,PERIODICELEMENT_LOG } from './service/ajax/errorList/error-list.service';
import { MuleChartService,muleStateElement } from './service/muleChart/mule-chart.service';

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
    private muleChartService:MuleChartService) {}

   ngOnInit() {
    this.socket.listenSocket('callErrorList').subscribe(
      (res)=>{this.getErrorList(res);});
      this.socket.listenSocket('callAllServerState').subscribe(
      (res)=>{this.getAllServer(res);});
      this.socket.listenSocket('CallMuleState').subscribe(
      (res)=>{this.getMuleState(res);});

      this.socket.initUser();
   }

  getAllServer(data){    
    this.allServerStateData = data["callAllServerState&"];
  }
  
  getErrorList(data){
    let d = data["callErrorList&"];
    let tmp:any = d["mule"]["errorList"].data;
    let tmpLog:any = d["mule"]["errorLog"].data;
    this.tabledata =  this.errorListService.convertToJSON("list",tmp);
    this.tabledataLog =  this.errorListService.convertToJSON("",tmpLog);
    this.errorListService.sendMessage(this.tabledata);
    this.errorListService.sendMessage_log(this.tabledataLog);
    this.errorListService.createServicesList(this.tabledata);
  }

  getMuleState(data){
    this.muleState = data;
    this.muleChartService.sendMessage(this.muleState);
  }

}
