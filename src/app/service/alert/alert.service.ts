import { Injectable } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AlertServiceService {

  constructor(
    private alertService: AlertService,
    private _location: Location) { }

  
  alert(option:string,message:string){
    
    switch(option){

      case "success":
          this.alertService.success({html: `<h6>${message}</h6>`});
        break;
        case "info":
            this.alertService.info({html: `<h6>${message}</h6>`});
        break;
        case "danger":
            this.alertService.danger({html: `<h6>${message}</h6>`});
        break;
        case "warning":
            this.alertService.warning({html: `<h6>${message}</h6>`});
        break;

        default:
            this.alertService.info({html: `<h6>${message}</h6>`});
        break;
    }

    setTimeout(()=>{ 
      this._location.back();
    }, 1000);

  }

}
