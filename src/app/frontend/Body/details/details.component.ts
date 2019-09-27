import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { MatDialog } from '@angular/material';
import { ErrorListService, PERIODICELEMENT_LIST, PERIODICELEMENT_LOG, DISPLAYEDCOLUMNS_LISTS, DISPLAYEDCOLUMNS_LOGS,ERRORLIST_STATIC} from 'src/app/service/ajax/errorList/error-list.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit {

  displayedColumns_list: string[] = DISPLAYEDCOLUMNS_LISTS;
  displayedColumns_log: string[] = DISPLAYEDCOLUMNS_LOGS; 

  errorLog:PERIODICELEMENT_LOG[];
  errorList:PERIODICELEMENT_LIST[];

  dataSource_list:any;
  dataSource_log:any;

  subscription:Subscription;
  showService:string;

  sortedData: PERIODICELEMENT_LIST[];

  @ViewChild('paginator', {static: true}) paginator_list: MatPaginator;
  @ViewChild('paginator2', {static: true}) paginator_log: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnChanges() {}
  constructor(
    public dialog: MatDialog,
    private getErrList:ErrorListService,
    private routerParam:ActivatedRoute,
    private _router:Router){
      this.showService = this.routerParam.snapshot.queryParams.service;
      
    }
  ngOnInit() {
    this.firstGetErrlistManually();
    this.getMessageFromErrListService();
  }
  getMessageFromErrListService(){
    this.subscription = this.getErrList.getMessage_log().subscribe(
      message => {
        this.errorLog = message;
        this.initTable(this.errorList,"");
      }
    );
    this.subscription = this.getErrList.getMessage().subscribe(
      message => {
        this.errorList = message;
      }
    );

    
  }
  firstGetErrlistManually(){
    this.getErrList.getErrorList().subscribe((data)=>{
      let tmpList:any = data["callErrorList&"].mule.errorList.data;
      let tmpLog:any = data["callErrorList&"].mule.errorLog.data;
      this.errorList =  this.getErrList.convertToJSON("list",tmpList);
      this.errorLog =  this.getErrList.convertToJSON("log",tmpLog);
      this.initTable(this.errorList,this.showService);
    });
  }

  ngOnDestroy(): void {
    //unsubscribe to ensure no memory leaks.
    //this.subscription.unsubscribe();
  }


  initTable(data:PERIODICELEMENT_LIST[],filter:string){
    this.dataSource_list = "";
    this.dataSource_log = "";
    this.dataSource_list = new MatTableDataSource<PERIODICELEMENT_LIST>(data);
    this.dataSource_log = new MatTableDataSource<PERIODICELEMENT_LOG>(this.errorLog);
    this.dataSource_list.sort = this.sort;
    this.dataSource_log.sort = this.sort;
    this.dataSource_list.paginator = this.paginator_list;
    this.dataSource_log.paginator = this.paginator_log;
    if(filter !== "")this.dataSource_list.filter = filter;
    
    //this.changeDetectorRefs.detectChanges();
  }

  applyFilter(filtervalue: string){
      this.dataSource_list.filter = filtervalue.trim().toLocaleLowerCase();
  }

  rowclick(row:any,option:string): void { 
    this._router.navigate(['/error'],{queryParams: {
      option:option,
      id:row.id,
      tracdid:row.TraceID,
      status:row.status,
      tfsBug:row.TFSBug,
      user:row.BearbeitetVon}});
  } 

  openDialog(data){
    let showdata = data.complexdata.Mule[0];
    const dialogRef = this.dialog.open(ErrorPageComponent, {
      width: '90%',
      height: '77%',
      data: { rowData: showdata }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed' + result);
    });
  }
}
