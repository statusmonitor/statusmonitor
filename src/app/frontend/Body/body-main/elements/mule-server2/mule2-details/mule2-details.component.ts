import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { muleStateElement, MuleChartService } from 'src/app/service/muleChart/mule-chart.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-mule2-details',
  templateUrl: './mule2-details.component.html',
  styleUrls: ['./mule2-details.component.css']
})
export class Mule2DetailsComponent implements OnInit {
  dialogdata:muleStateElement;
  LineChart;
  von: string;
  bis: string;
  fRam:string;
  tRam:string;

  constructor(
  public dialogRef:MatDialogRef<Mule2DetailsComponent>,
  private mule:MuleChartService,
  @Inject (MAT_DIALOG_DATA) public data: muleStateElement) {
    this.dialogdata = this.data["rowData"];
    this.von = new Date().toISOString().slice(0, 16);
    this.bis = new Date().toISOString().slice(0, 16);
  }

  onNoClick():void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.initChart(0,"","");
  }
  toDateString(date: string):string {
    let datea = new Date(date);
    let month = ("0" + (datea.getMonth() + 1)).slice(-2);
    let day = ("0" + (datea.getDate())).slice(-2);
    let year = datea.getFullYear().toString();
    let time = 'T' + datea.toTimeString().slice(0,5);
    return `${day}-${month}-${year}${time}`;
}
  suchen(){
    this.toDateString(this.von);
    let obj:object = {};
    obj = {
      "von":this.toDateString(this.von),
      "bis":this.toDateString(this.bis),
    }
    let start = this.toDateString(this.von);
    let end = this.toDateString(this.bis);
    let usage:Array<number> = [];
    let date:Array<string> = [];
    let usedRam:Array<number> = [];
    this.mule.getmyoldState(start,end).subscribe(
      (data)=>{
        if(data.success){
          let getData = data["complexdata"].Pausenstatus;
          Object.keys(data["complexdata"].Pausenstatus).forEach(function (item) {
            usage.push(parseInt(getData[item]["cpuUsage"]));
            date.push(getData[item]["datum"]);
            usedRam.push(parseInt(getData[item]["totalRam"]) - parseInt(getData[item]["freeRam"]));
          });
          this.initChart(usage,usedRam,date);
        }
      }
    );
  }

  initChart(usage,usedRam,labels){
    let datasetLine = this.dataCombinedLine(usage);
    let datasetCombined = this.dataCombinedBar(usedRam);
    // Line chart:
    this.LineChart = new Chart('lineChart2_details', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: []
      }, 
      options: {
        title:{ text:"Mule 2",display:true},
        elements:{point:{radius:1}},
        legend:{ position: "bottom"},
        responsive: true,
        maintainAspectRatio: false,
        scales:{
          xAxes: [{
            position: "bottom",
            ticks: {
                autoSkip: true,
                maxTicksLimit: 7,
                maxRotation: 0,
                minRotation: 0,
                callback: function (label,index,lebels){
                  let rDate = new Date(label);
                  let month = ("0" + (rDate.getMonth() + 1)).slice(-2);
                  let day = ("0" + (rDate.getDate())).slice(-2);
                  let year = rDate.getFullYear().toString();
                  let time = rDate.toTimeString().slice(0,5);
                  return `${day}-${month}-${year} ${time}`;
                }
            }
        }],
         yAxes: [{
          type: "linear",
          display: true,
          position: "left",
          id: "y-axis-0",
          gridLines: {},
           ticks: {
             beginAtZero:true,
             callback: function (label,index,lebels){
               return label +" %";
             }
            }
          },
          {
            type: "linear",
            display: true,
            position: "right",
            id: "y-axis-1",
            gridLines: {
            },
            ticks: {
              beginAtZero:true,
              callback: function (label,index,lebels){
                return label +" MB";
              }
             }
          }
        ]}
      }
    });
    if (datasetLine != null) {
      this.LineChart.data.datasets.push(datasetLine);
  }

    if (datasetCombined != null) {
      this.LineChart.data.datasets.push(datasetCombined);
    }
    this.LineChart.update();

  }


  
  dataCombinedLine(entry):object {
    var dataset = {
        type: "line",
        label: 'cpu usage',
        lineTension: 0,
        backgroundColor: "red",
        //borderCapStyle: "butt",
        //borderJoinStyle: "miter",
        borderColor: "red",
        pointRadius: 1,
        pointBorderColor: "",
        borderWidth: 2,
       //pointBackgroundColor: "#FFFFFF",
        //pointBorderWidth: 3,
       // pointHoverRadius: 5,
        //pointHoverBackgroundColor: "#FFFFFF",
       // pointHoverBorderWidth: 3,
        pointHitRadius: 5,
        data: entry,
        yAxisID : "y-axis-0",
        fill: false
    }
    return dataset;
}
dataCombinedBar(entry):object {
  var dataset = {
      type: "bar",
      label: 'used ram',
      borderWidth: 2,
      backgroundColor: "#DCDCDC",
      //borderCapStyle: "butt",
      //borderJoinStyle: "miter",
      borderColor: "#FFE4E1",
      data: entry,
      yAxisID : "y-axis-1"
  }
  return dataset;
}
}
