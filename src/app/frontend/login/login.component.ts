import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebloginService } from 'src/app/guard/weblogin/weblogin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  env:string;
  user:string;
  constructor(
    private router:Router,
    private weblogin:WebloginService
    ) { }

  ngOnInit() {
    if(!this.weblogin.isLogined())this.weblogin.weblogin();
    else this.router.navigate(['/main']);
  }
}
