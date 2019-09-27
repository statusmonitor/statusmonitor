import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Buffer } from 'buffer';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MuleChartService {

  private _url = "/kontaktcenteradministration/";
  private auth =  new Buffer('Statusmonitor:db41f2598fc1ecd2e407f3d8ce59fe78').toString("base64");
  private env = "test";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': "Basic " + this.auth
    })
  };

  constructor(private http: HttpClient) { }
  private messageSource = new Subject<muleStateElement>();
  messageTransfer = this.messageSource.asObservable();
  sendMessage(message:muleStateElement){
    this.messageSource.next(message);
  }

  clearMessage(){
    this.messageSource.next();
  }

  getMessage():Observable<muleStateElement>{
    return this.messageSource.asObservable();
  }

  getmyState(){
    let call = 'Statusmonitor_getMyState';
    return this.http.post<any>(this._url + call,"",this.httpOptions);
  }

  getmyoldState(von:string,bis:string){
    let call = 'Statusmonitor_getCpuUsage';
    let postSet = new HttpParams().set("env",this.env).set("von",von).set("bis",bis);
    return this.http.post<any>(this._url + call,postSet,this.httpOptions);
  }

  configForRealTime(title):object{

    let config = {
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
            text:title,
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
    }
    return config;
  }

  configForDetail(labels,title):object{

    let config = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: []
      }, 
      options: {
        title:{ text:title,display:true},
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
    }
    return config;
  }

  dataCombinedLine(entry):object {
    var dataset = {
        type: "line",
        label: 'cpu usage',
        lineTension: 0,
        backgroundColor: "red",
        borderColor: "red",
        pointRadius: 1,
        pointBorderColor: "",
        pointHitRadius: 5,
        borderWidth: 2,
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
      borderColor: "#FFE4E1",
      data: entry,
      yAxisID : "y-axis-1"
  }
  return dataset;
}

}


export interface muleStateElement{
  freeram: string,
  ramint: number,
  usedram: string,
  freeramint:number,
  cpuUsageDouble:number,
  cpuUsageStr:string,
  totalram:string
}
