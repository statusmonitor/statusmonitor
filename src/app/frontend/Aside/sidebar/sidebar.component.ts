import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { AllServerStateService,allServerStateElement,AllServer } from 'src/app/service/allServerState/all-server-state.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit,OnChanges {
  @Input() 
  _allServertmp:allServerStateElement;
  allServer:AllServer[];

  constructor(private allServerState:AllServerStateService){}
  ngOnChanges(changes: SimpleChanges) {
    if(changes['_allServertmp'].currentValue){
      this.allServer = this.allServerState.changeToClassData(this._allServertmp);
    }
  }

  ngOnInit() {  }

}
