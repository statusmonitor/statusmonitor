import { Component, OnInit,Input, SimpleChanges, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { muleStateElement, MuleChartService } from 'src/app/service/muleChart/mule-chart.service';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';
import { MatDialog } from '@angular/material';
import { Mule2DetailsComponent } from './mule2-details/mule2-details.component';

@Component({
  selector: 'app-mule-server2',
  templateUrl: './mule-server2.component.html',
  styleUrls: ['./mule-server2.component.css']
})
export class MuleServer2Component implements OnInit, OnChanges {

  lineChart:any;
  updateCnt = 0;
  nbElement = 10;
  cpu:number;
  GRAM:string;
  cpuStr:string;
  FRAM:string;
  RAM:string;

  @Input() mule2State:muleStateElement;

  constructor(
    public socket:SocketIOService,
    private muleChartService:MuleChartService,
    public dialog: MatDialog
    ) { }

  ngOnChanges(changes: SimpleChanges){
    if(changes["mule2State"]["currentValue"]){
      let tmp:any = changes["mule2State"]["currentValue"];
      this.mule2State = tmp;
      this.cpu = this.mule2State["cpuint"];
      this.cpuStr = this.cpu.toString();
      this.GRAM = this.mule2State["usedram"];
      this.FRAM = this.mule2State["freeram"];
      this.RAM = this.mule2State["totalram"];

      /**
      //for myState_new
      let tmp:any = changes;
      this.mule2State = tmp.mule2State.currentValue;
      this.cpu = this.mule2State.cpuUsageDouble;
      this.cpuStr = this.mule2State.cpuUsageStr;
      this.GRAM = this.mule2State.usedram;
      this.FRAM = this.mule2State.freeram;
      this.RAM = this.mule2State.totalram;
       */
      this.setData(this.cpu);
    }
     
  }
  showdata(){}

  open(): void {
    let showdata = this.mule2State;
    const dialogRef = this.dialog.open(Mule2DetailsComponent, {
      width: '60%',
      height: '77%',
      data: { rowData: showdata }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }
  ngOnInit() {
    this.initChart();
  }

  setData(cpu){

    this.lineChart.data.labels.push(new Date());

    this.lineChart.data.datasets.forEach(
      (dataset) =>{dataset.data.push(cpu)});

      if(this.updateCnt >= this.nbElement){
        this.updateCnt = 0;
        this.removeData(this.lineChart);

      }else{
        this.updateCnt++;
        this.lineChart.update();
      }
  }
  
   removeData(chart) {
     let label:number = 1;
     let data:number = 1;

    if(chart.data.datasets[0].data.length > 100){label = 11;data = 11;}
    chart.data.labels.splice(0, label);

    chart.data.datasets.forEach((dataset) => {
      dataset.data.splice(0, data);
    });

    chart.update();
}

  initChart(){
    let config:object = this.muleChartService.configForRealTime("Mule-2");
    this.lineChart = new Chart('lineChart2',config);
  }

}