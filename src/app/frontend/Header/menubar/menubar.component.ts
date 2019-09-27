import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { PERIODICELEMENT_LIST } from 'src/app/service/ajax/errorList/error-list.service';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';

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

  constructor(private socket:SocketIOService) {}

  ngOnChanges(changes: SimpleChanges){
    if(changes['tabledata']){this.passdata = this.tabledata;}
  }

  onToggleSidenav(env:string){
    if(env){
      env = env.toLowerCase();
      let user = localStorage.getItem("user");
    let obj:object = {
      "oldenv":this.umgebung.toLowerCase(),
      "newenv":env,
      "user":user
    };
    this.socket.callSocket('update',obj);
    this.umgebung = env.toUpperCase();
    localStorage.setItem("env",env);
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
