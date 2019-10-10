import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subject } from 'rxjs';
import { UserService,User } from '../users/user.service';
import { AppConfig } from 'app.config';

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  user:User;

  constructor(
    private socket: Socket,
    private userService:UserService
    ) {
      this.socket.on('connect',()=>{});
      this.socket.on('disconnect',()=>{});
      this.socket.on('init',(id:string)=>{this.createUser(id);});
      
      this.socket.on('saveUsers',(res)=>{
        if(this.userService.updateUserList(res)){
          this.updateAllUsersEnv();
        }
      });

    this.socket.on('delUser',(id)=>{
      let name = this.user.name;
      if(this.userService.delUserList(id)){
        console.log(`${name} : disconnected`);
        this.updateAllUsersEnv();
      } 
    });
  }

  initUser(){
    this.socket.emit('getIDFromServer');
  }
  createUser(id:string){

    let obj = {
      "id": id,
      "user" : localStorage.getItem('user'),
      "env": AppConfig.settings.env.name
    };

    this.user = this.userService.createUser(obj);

    if(this.user){
      this.socket.emit('initUserToServer',{"obj":obj,"user":this.user});
      this.changeUserEnvFrontEnd();
      console.log(`${this.user.name} : connected`);
    }

  }

  updateAllUsersEnv(){
    this.userService.sendMessage(this.userService.clients);
  }

  changeUserEnvFrontEnd(){
    this.sendMessage(this.user.room);
  }

  listenSocket(event:string){ 
    return new Observable((subscriber)=>{
      this.socket.on(event, (data)=>{
        subscriber.next(data);
      })
    })
  };

  callSocket(event:string,data:object){
    data["socketID"] = this.socket.ioSocket.id;
    this.socket.emit(event,data);
  }

  private messageSource = new Subject<string>();
  messageTransfer = this.messageSource.asObservable();

  sendMessage(message:string){
    this.messageSource.next(message);
  };

  clearMessage(){
    this.messageSource.next();
  };

  getMessage():Observable<string>{
    return this.messageSource.asObservable();
  };

}