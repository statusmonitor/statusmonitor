import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WebloginService } from 'src/app/guard/weblogin/weblogin.service';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {

  constructor(
    private routerParam:ActivatedRoute,
    private auth:WebloginService,
    private router:Router
    ) { }
  sessionID:string;
  user:string;
  ngOnInit() {
    this.sessionID = this.routerParam.queryParams["value"].sessionID;
    this.user = this.routerParam.queryParams["value"].user;
    
    if(this.sessionID){
      this.auth.setSessionID(this.sessionID);
      this.auth.setUser(this.user);
      this.auth.setEnv("dev");
      //this.auth.sendMessage(true);
      this.router.navigate(['/main']);
    }
    else this.auth.sendMessage(false);
  }

}
