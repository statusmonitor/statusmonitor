import { Component, OnInit } from '@angular/core';
import { MuleChartService,muleStateElement } from 'src/app/service/muleChart/mule-chart.service';
import { ErrorListService, PERIODICELEMENT_LIST } from 'src/app/service/ajax/error-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-body-main',
  templateUrl: './body-main.component.html',
  styleUrls: ['./body-main.component.css']
})
export class BodyMainComponent implements OnInit {

  muleState1:muleStateElement;
  muleState2:muleStateElement;
  errorList:PERIODICELEMENT_LIST[];
  subscription:Subscription;

    constructor(
    private muleChartService: MuleChartService,
    private errorListService: ErrorListService) {
     }


    getMessageFromErrListService(){
      this.subscription = this.errorListService.getMessage().subscribe(
        message => {
          this.errorList = message;
        }
      );
    }

    getMessageFromMuleStateService(){
      this.subscription = this.muleChartService.getMessage().subscribe(
        (message:any) => {
          let div:string = message.target;
          div = div.substring(div.length -1);
          this.muleState1 = (div === "1") ? message : undefined;
          this.muleState2 = (div === "2") ? message : undefined;
        }
      );
    }

  ngOnInit() {
    this.getMessageFromErrListService();
    this.getMessageFromMuleStateService();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
