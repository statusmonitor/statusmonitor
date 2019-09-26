import { Component, OnInit,ViewChild, TemplateRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorListService,detailsElement } from 'src/app/service/ajax/error-list.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm} from '@angular/forms';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})

export class ErrorPageComponent implements OnInit,AfterViewInit {
  @ViewChild('showAlert',{static: false}) showAlert: TemplateRef<any>;
  @ViewChild('dialogUserSelect',{static: false}) dialogUserSelect: TemplateRef<any>;
  @ViewChild('dialogFixBug',{static: false}) dialogFixBug: TemplateRef<any>;
  @ViewChild('dialogNewBug',{static: false}) dialogNewBug: TemplateRef<any>;
  @ViewChild('dialogLinkBug',{static: false}) dialogLinkBug: TemplateRef<any>;
  
  ngAfterViewInit(): void {}

  showData:detailsElement;
  id:string;
  tracdid:string;
  status:string;
  tfsBug:string;
  user:string;
  message:string;
  selectedUser:string;
  option:string;

  flag1:Boolean = true;
  flag2:boolean = true;
  flag3:boolean = true;
  constructor(
    private routerParam:ActivatedRoute,
    private getErrList:ErrorListService,
    private dialog: MatDialog,
    private socket:SocketIOService,
    private _location: Location) { 
      this.option = this.routerParam.snapshot.queryParams.option; 
      this.id = this.routerParam.snapshot.queryParams.id;
      this.tracdid = this.routerParam.snapshot.queryParams.tracdid;
      this.status = this.routerParam.snapshot.queryParams.status;
      this.tfsBug = this.routerParam.snapshot.queryParams.tfsBug;
      this.user = this.routerParam.snapshot.queryParams.user;
     }

  ngOnInit() {
  this.initData();

  this.socket.listenSocket('message').subscribe(
    (res:string)=>{
      this.alert(res);
    });
  }

  initData(){
    this.getErrList.getErrorTraceLog(this.tracdid).subscribe(
      (data)=>{
        if(data.success){
          if(!data.complexdata.Mule[0]){
            this.alert("Es gibt kein Details");
          }

          if(/*user !==session ||*/ (this.tfsBug)){
            this.flag1 = false;
          }

          if(/*user !== session*/true) {
            if(this.status ==="0"){this.flag2 = true;}
            else{this.flag2 = false;}
          }

          if(this.tfsBug){
            this.flag3 = false;
          }

          this.showData = data.complexdata.Mule[0];

        }else{
          console.error(data.error.Error);
        }       
      }
    )
  }
  
  abbrechen(){
    let env = localStorage.getItem("env").toLocaleLowerCase();
    let obj:object = {
      "oldenv":env,
      "newenv":env
    };
    this.socket.callSocket('update',obj);
    this._location.back();
  }

  alert(message:string){
    this.message = message;
    this.dialog.open(this.showAlert);
  }



  openDialog(option:string){
    if(option){
      switch(option){
        case 'gefixt':
            if(this.tfsBug){
              //markFixOpenFunctionIssue
              this.dialog.open(this.dialogFixBug, {width: '30%',height: '52%'});
            }else{
              this.gefixt();
            }
        break;

        case 'uebernehmen':
            this.dialog.open(this.dialogUserSelect, {width: '30%',height: '28%'});
        break;

        case 'erstellen':
            this.dialog.open(this.dialogNewBug, {width: '30%',height: '62%'});
        break;

        case 'verknpfen':
            this.dialog.open(this.dialogLinkBug, {width: '30%',height: '28%'});
        break;

        case 'entkoppeln':
            this.entkoppeln();
        break;

        case 'oeffnen':
            this.oeffnen();
        break;

        case 'ablegen':
            this.ablegen();
        break;
        
        default:
        break;
      }
    }
  }

  loeschen(){
    let obj:object = {};
    obj = {"id":this.id};
    this.getErrList.loeschen(this.id).subscribe(
      (res)=>{
        this.alert("der Befehl wurde erfolgreich ausgeführt");
      }
    );
    //this.socket.callSocket('mule',obj); 
  }

  ablegen(){
    let obj:object = {};
    obj = {"id":this.id};
    this.getErrList.ablegen(this.id).subscribe(
      (res)=>{
        this.alert("der Befehl wurde erfolgreich ausgeführt");
      }
    );
    //this.socket.callSocket('mule',obj);
  }
  oeffnen(){
    let obj:object = {};
    obj = {"id":this.id};
    this.getErrList.oeffnen(this.id).subscribe(
      (res)=>{
        this.alert("der Befehl wurde erfolgreich ausgeführt");
      }
    );
    //this.socket.callSocket('mule',obj);
  }
  gefixt(){
      //markTestOpenFunctionIssue
    let obj:object = {};
    obj = {"id":this.id};
    this.getErrList.gefixt(this.id).subscribe(
      (res)=>{
        this.alert("der Befehl wurde erfolgreich ausgeführt");
      }
    );
   // this.socket.callSocket('mule',obj);
  }
  entkoppeln(){
    let obj:object = {};
    obj = {"id":this.id};
    this.getErrList.entkoppeln(this.id).subscribe(
      (res)=>{
        this.alert("der Befehl wurde erfolgreich ausgeführt");
      }
    );
   // this.socket.callSocket('mule',obj);
  }
  
  markOpenFunctionIssue(f: NgForm){//uebernehmen
    let obj:object = {};
    if(f.valid){
        obj = {
        "id":this.id,
        "user":f.value["selectedUser"]
      };
      this.getErrList.uebernehmen(obj).subscribe(
        (res)=>{
          this.alert("der Befehl wurde erfolgreich ausgeführt");
        }
      );
     // this.socket.callSocket('mule',obj);
    }
  }

  markFixOpenFunctionIssue(f: NgForm) {//gefixt_tfsBug
     let obj:object = {};
     if(f.valid){
         obj = {
         "id":this.id,
         "message":f.value["beschreibung"],//"Session.fullname",
         "time":f.value["work"]
       };
       this.getErrList.gefixt_tfsBug(obj).subscribe(
        (res)=>{
          this.alert("der Befehl wurde erfolgreich ausgeführt");
        }
      );
      // this.socket.callSocket('mule',obj);
     }
   }

   createTFSBug(f: NgForm) {//erstellen
    let obj:object = {};
    if(f.valid){
        obj = {
        "id":this.id,
        "user":"Kyeongseon Choe",//"Session.fullname",
        "assign":f.value["zuweisen"],
        "severity":f.value["prio"],
        "description":f.value["beschreibung"]
      };
      this.getErrList.erstellen(obj).subscribe(
        (res)=>{
          this.alert("der Befehl wurde erfolgreich ausgeführt");
        }
      );
    //  this.socket.callSocket('mule',obj);
    }
  }

  Statusmonitor_linkTFS(f: NgForm) {//verknpfen
    let obj:object = {};

    if(f.valid){
        obj = {
        "id":this.id,
        "bug":f.value["number"]
      };
      this.getErrList.verknpfen(obj).subscribe(
        (res)=>{
          this.alert("der Befehl wurde erfolgreich ausgeführt");
        }
      );
     // this.socket.callSocket('mule',obj);
    }
  }

}

