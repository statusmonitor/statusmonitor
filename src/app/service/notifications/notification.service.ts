import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public permission:string;

  constructor() { 
    this.permission = this.isSupported() ? 'default':'denied';
  }

  public isSupported():boolean{
    return 'Notification' in Window;
  }
  requestPermisson():void{
    let self = this;
    if('Notification' in window){
      Notification.requestPermission((status)=>{
         return self.permission = status;
      })
    }
  };
  
  create(title:string, options:object, traceid:string, env:string):any{
    let self = this;
    return new Observable((obs)=>{

     if (!('Notification' in window)) {
       console.log('Notifications are not available in this environment');
       obs.complete();
     }

     if(self.permission !== 'granted'){
       console.log("The user hasn't granted you permission to send push notifications");
       obs.complete();
     }

     let _notify = new Notification(title,options);
     _notify.onshow = function(e){
       return obs.next({
         notification: _notify,
         event: e
       })
     };
     _notify.onclick = function(e) {
      window.open("https://kontaktcenter-status.buhl.de/statusmonitor/debug_calls/index.php?trace_id=" + traceid + "&env="+env);
       return obs.next({
           notification: _notify,
           event: e
       });
     };
     _notify.onerror = function(e) {
         return obs.error({
             notification: _notify,
             event: e
         });
     };
     _notify.onclose = function() {
         return obs.complete();
     };

   });
  }

  generateNotification(source: Array < any > ): void {
    let self = this;
    source.forEach((item) => {
        let options = {
            body: item.alertContent
        };
        let notify = self.create(item.title, options,item.traceID, item.env).subscribe();
    })
  }

}

export declare type Permission = 'denied' | 'granted' | 'default';
export interface PushNotification {
    body ? : string;
    icon ? : string;
    tag ? : string;
    data ? : any;
    renotify ? : boolean;
    silent ? : boolean;
    sound ? : string;
    noscreen ? : boolean;
    sticky ? : boolean;
    dir ? : 'auto' | 'ltr' | 'rtl';
    lang ? : string;
    vibrate ? : number[];
}
