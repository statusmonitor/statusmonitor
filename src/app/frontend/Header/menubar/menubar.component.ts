import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { PERIODICELEMENT_LIST } from 'src/app/service/ajax/errorList/error-list.service';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';
import { UserService } from 'src/app/service/users/user.service';
import { WebloginService } from 'src/app/guard/weblogin/weblogin.service';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit,OnChanges {

  @Input()
  tabledata:PERIODICELEMENT_LIST[];
  passdata:PERIODICELEMENT_LIST[];
  umgebung:string;

  constructor(
    private socket:SocketIOService,
    private auth:WebloginService) {}

  ngOnChanges(changes: SimpleChanges){
    if(changes['tabledata']){this.passdata = this.tabledata;}
  }

  onToggleSidenav(env:string){
    if(env){
      env = env.toLowerCase();
      let user = this.auth.getUser();

    let obj:object = {
      "oldenv":this.umgebung.toLowerCase(),
      "newenv":env,
      "user":user
    };
    
    this.socket.callSocket('updateEnv',obj);
    
    this.umgebung = env.toUpperCase();
    this.auth.setEnv(env);
    }
  }

  ngOnInit() {
    this.socket.getMessage().subscribe(
      (message)=>{
        let env = message;
        this.umgebung = env.toUpperCase();
      }
    )

  }

}
