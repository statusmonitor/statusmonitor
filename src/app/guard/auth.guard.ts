import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { WebloginService } from './weblogin/weblogin.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{
  constructor(
    private authService:WebloginService
    ){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{
    if(this.authService.isLogined()){
      this.authService.sendMessage(true);
      return true;
    }else{
      this.authService.sendMessage(false);
      return false;
    }
  }
}

