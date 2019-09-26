import { Component, OnInit,Input, SimpleChanges, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { muleStateElement } from 'src/app/service/muleChart/mule-chart.service';
import { SocketIOService } from 'src/app/service/socketIO/socket-io.service';
import { MuleDetailsComponent } from './mule-details/mule-details.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-mule-server1',
  templateUrl: './mule-server1.component.html',
  styleUrls: ['./mule-server1.component.css']
})

export class MuleServer1Component implements OnInit, OnChanges {
  
  LineChart:any;
  updateCnt = 0;
  nbElement = 10;
  cpu:number = 0;
  cpuStr:string;
  GRAM:string;
  FRAM:string;
  RAM:string;

  @Input() mule1State:muleStateElement;
  
  constructor(
    public socket:SocketIOService,
    public dialog: MatDialog) { }

  ngOnChanges(changes: SimpleChanges){
    if(changes["mule1State"]["currentValue"]){
      let tmp:any = changes["mule1State"]["currentValue"];
      this.mule1State = tmp;
      this.cpu = this.mule1State["cpuint"];
      this.cpuStr = this.cpu.toString();
      this.GRAM = this.mule1State["usedram"];
      this.FRAM = this.mule1State["freeram"];
      this.RAM = this.mule1State["totalram"];
      /*
      //for myState_new
      let tmp:any = changes;
      this.mule1State = tmp.mule1State.currentValue;
      this.cpu = this.mule1State.cpuUsageDouble;
      this.cpuStr = this.mule1State.cpuUsageStr;
      this.GRAM = this.mule1State.usedram;
      this.FRAM = this.mule1State.freeram;
      this.RAM = this.mule1State.totalram;
      */
      this.setDataToChart(this.cpu);
    }
  }

  callTest(): void {
    //if(this.mule1State){
      let showdata = this.mule1State;
      const dialogRef = this.dialog.open(MuleDetailsComponent, {
        width: '60%',
        height: '77%',
        data: { rowData: showdata }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed' + result);
      });
    //}      
  }

  ngOnInit() {this.initChart();}

  setDataToChart(cpu){

    this.LineChart.data.labels.push(new Date());
    this.LineChart.data.datasets.forEach(
      (dataset) =>{dataset.data.push(cpu)});

      if(this.updateCnt >= this.nbElement){
        this.updateCnt = 0;
        this.removeData(this.LineChart);
        //this.LineChart.data.labels.shift();
       // this.LineChart.data.datasets[0].data.shift();

      }else{
        this.updateCnt++;
        this.LineChart.update();
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
ngOnDestroy(): void {}

  initChart(){
    // Line chart:
    this.LineChart = new Chart('lineChart1', {
      type: 'line',
      data: {
        datasets: [{
          label: 'test',
          data: [0],
          fill:false,
          borderColor:"blue",
          borderWidth: 2,
          pointBorderColor:""
        }]
      }, 

      options: {
        responsive: true,
        maintainAspectRatio: false,
        title:{
            text:"Mule-1",
            display:false
        },

        scales: {
          xAxes: [{
            type: 'time',
            time: {
              displayFormats: {
                minute: 'h:mm a'
              }
            }
          }],
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    callback: function (label,index,lebels){
                      return label +" %";
                    }
                }
            }]
        },
        legend: {display: false},
        tooltips:{
          enabled: false
        }
      }

    });
  }

}
