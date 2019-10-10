import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllServerStateService,allServerStateElement,AllServer } from 'src/app/service/ajax/allServerState/all-server-state.service';
import { UserService,users } from 'src/app/service/users/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit,OnChanges {
  @Input() 
  _allServertmp:allServerStateElement;
  allServer:AllServer[];
  userList:Array<string>;
  constructor(
    private userService:UserService,
    private allServerState:AllServerStateService){}
    
  ngOnChanges(changes: SimpleChanges) {
    if(changes['_allServertmp'].currentValue){
      this.allServer = this.allServerState.changeToClassData(this._allServertmp);
    }
  }

  ngOnInit() {
    this.userService.getMessage().subscribe(
      (message:users)=>{
        let getKeys = Object.keys(message);
        let list = [];
        for (let key of getKeys) { 
          list.push(message[key]);
      }
        this.userList = list;
      }
    )
   }

}
