import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  clients:object = {};
  id:string;
  env:string;
  user:string;

  private messageSource = new Subject<string>();
  messageTransfer = this.messageSource.asObservable();

  constructor(private socket: Socket) {
    this.socket.on('connect',()=>{
      //console.log(`connected from client`)
    })
    
    this.socket.on('disconnect',()=>{
      //console.log(`disconnected from client`)
    })
    
    this.socket.on('saveUserInfo',(res)=>{
      this.id = res["id"]; 
    })
    this.socket.on('delUsers',(user)=>{delete this.clients[user];})

  }
  initSocket(){
    this.env = localStorage.getItem('env');
    this.user = localStorage.getItem('user');
    let obj = {
      "id" : this.id,
      "env" : this.env,
      "user" : this.user
    }
    this.socket.emit('init',obj);
    this.sendMessage(this.env);
  }
  
  listenSocket(event:string){ 
    return new Observable((subscriber)=>{
      this.socket.on(event, (data)=>{
        subscriber.next(data);
      })
    })
  };
  
  callSocket(event:string,data:object){
    data["socketID"] = this.id;
    data["env"] = localStorage.getItem('env');
    this.socket.emit(event,data);
  }

  changeUmgebung(){
    this.socket.emit('connection');
  }

  sendMessage(message:string){
    this.messageSource.next(message);
  }
  clearMessage(){
    this.messageSource.next();
  }

  getMessage():Observable<string>{
    return this.messageSource.asObservable();
  }
}