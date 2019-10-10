import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  clients:users;
  
  private messageSource = new Subject<users>();
  messageTransfer = this.messageSource.asObservable();
  constructor() { }

  createUser(data:object):User{

    let id:string = data["id"];
    let name:string = data["user"];
    let env:string = data["env"];
    let client:User = new User(id,name,env);

    return client;
  }

  updateUserList(users:users):boolean{
    if(users) {
      this.clients = users["clients"];
      return true;
    }
    return false;
  };

  delUserList(id):boolean{
    let returnVal:boolean = false;
    
    if(delete this.clients[id]){
      returnVal = true;
    }
    return returnVal;
  }

  getUserName(id:string):string{
    return this.findValue(id).name;
  }

  getUserCurrentEnv(id:string):string{
    return this.findValue(id).room;
  }

  setUserCurrentEnv(id:string,env:string):boolean{

    let returnVal:boolean = false;
    let val = this.findValue(id);
    if(val){
      val.room = env;
      returnVal = true;
    }
 
    return returnVal;
  }

  findValue(id:string):User{
    let returnVal:User;
    this.clients[id].find((el)=>{
      if(el.id === id){
        returnVal = el;
      } 
    });
    return returnVal;
  }

  sendMessage(message:users){
    this.messageSource.next(message);
  };

  clearMessage(){
    this.messageSource.next();
  };

  getMessage():Observable<users>{
    return this.messageSource.asObservable();
  };
}

export class User {
  _id:string;
  _name:string;
  _room:string;

  constructor(id:string,name:string,env:string){
    this._id = id;
    this._name = name;
    this._room = env;
  }
  get id():string{return this._id;}
  get name():string{return this._name;}
  get room():string{return this._room;}
  set room(env:string){this._room = env;}
}

export interface users {
  id:{
    id:string,
    user:string,
    room:string
  }
}