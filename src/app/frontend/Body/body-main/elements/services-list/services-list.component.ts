import { Component, OnInit,Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorListService,PERIODICELEMENT_LIST,SERVICES} from 'src/app/service/ajax/error-list.service';


@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.css']
})


export class ServicesListComponent implements OnInit, OnChanges{

  @Input() 
  errorList:PERIODICELEMENT_LIST[];
  menge:number;
  services:Array<SERVICES>;
  constructor(private _router:Router, private errorListService:ErrorListService) { }
  
  getServiceData(){
    this.errorListService.getErrorList().subscribe((data)=>{
      let tmp:any = data["callErrorList&"].mule.errorList.data;
      this.errorList =  this.errorListService.convertToJSON("list",tmp);
      this.services = this.errorListService.createServicesList(this.errorList);
      this.menge = this.errorList.length;
    });
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes["errorList"]["currentValue"] !== undefined){
      let tmp:any = changes;
      this.errorList = tmp.errorList.currentValue;
      this.services = this.errorListService.createServicesList(this.errorList);
      this.menge = this.errorList.length;
    }
  }

  ngOnInit() {this.getServiceData()}
  elementClick(service)
  {
    this._router.navigate(['/details'],{queryParams: {service:service}});
  }
}