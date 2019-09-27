import { Component, OnInit,Inject } from '@angular/core';
import { muleStateElement, MuleChartService } from 'src/app/service/muleChart/mule-chart.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-mule-details',
  templateUrl: './mule-details.component.html',
  styleUrls: ['./mule-details.component.css']
})
export class MuleDetailsComponent implements OnInit {

  dialogdata:muleStateElement;
  LineChart:any;
  von: string;
  bis: string;
  fRam:string;
  tRam:string;

  constructor(
    public dialogRef:MatDialogRef<MuleDetailsComponent>,
    private mule:MuleChartService,
    @Inject (MAT_DIALOG_DATA) public data: muleStateElement
    ) {
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

  private dateToString(date: string):string {
    let datea = new Date(date);
    let month = ("0" + (datea.getMonth() + 1)).slice(-2);
    let day = ("0" + (datea.getDate())).slice(-2);
    let year = datea.getFullYear().toString();
    let time = 'T' + datea.toTimeString().slice(0,5);
    return `${day}-${month}-${year}${time}`;
}

suchen(){
  let start = this.dateToString(this.von);
  let end = this.dateToString(this.bis);

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
    let chartName = 'lineChart1_details'
    let config = this.mule.configForDetail(labels,"Mule-1");
    let datasetLine = this.mule.dataCombinedLine(usage);
    let datasetCombined = this.mule.dataCombinedBar(usedRam);

    this.LineChart = new Chart(chartName, config);

    if (datasetLine != null) {
        this.LineChart.data.datasets.push(datasetLine);
    }
    if (datasetCombined != null) {
      this.LineChart.data.datasets.push(datasetCombined);
    }
    
    this.LineChart.update();
  }

}