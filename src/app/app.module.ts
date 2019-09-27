import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { MenubarComponent } from './frontend/Header/menubar/menubar.component';
import { SidebarComponent } from './frontend/Aside/sidebar/sidebar.component';
import { MuleServer1Component } from './frontend/Body/body-main/elements/mule-server1/mule-server1.component';
import { MuleServer2Component } from './frontend/Body/body-main/elements/mule-server2/mule-server2.component';
import { ServicesListComponent } from './frontend/Body/body-main/elements/services-list/services-list.component';
import { DetailsComponent } from './frontend/Body/details/details.component';
import { BodyMainComponent } from './frontend/Body/body-main/body-main.component';
import { ErrorListService } from './service/ajax/errorList/error-list.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorPageComponent } from './frontend/Body/error-page/error-page.component';
import { SocketIoModule,SocketIoConfig } from 'ngx-socket-io';
import { SocketIOService } from './service/socketIO/socket-io.service';
import { MuleChartService } from './service/muleChart/mule-chart.service';
import { AllServerStateService } from './service/ajax/allServerState/all-server-state.service';
import { MuleDetailsComponent } from './frontend/Body/body-main/elements/mule-server1/mule-details/mule-details.component';
import { Mule2DetailsComponent } from './frontend/Body/body-main/elements/mule-server2/mule2-details/mule2-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './frontend/login/login.component';
import { TokenInterceptorService } from './guard/HttpInterceptor/token-interceptor.service';
import { WebloginService } from './guard/weblogin/weblogin.service';
import { LoginSuccessComponent } from './frontend/login/login-success/login-success.component';
import { CookieService } from 'ngx-cookie-service';
import { AppConfig } from '../../app.config';
import { AlertModule } from 'ngx-alerts';

export function initializeApp(appConfig:AppConfig){
  return ()=>appConfig.load();
}
const config: SocketIoConfig ={
  url:"http://linux-entwicklung.sw.buhl-data.com:3001",
  options:{}
}

let guard = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptorService,
  multi: true
}

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    SidebarComponent,
    MuleServer1Component,
    MuleServer2Component,
    ServicesListComponent,
    DetailsComponent,
    BodyMainComponent,
    ErrorPageComponent,
    MuleDetailsComponent,
    Mule2DetailsComponent,
    LoginComponent,
    LoginSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    AlertModule.forRoot({maxMessages: 3, timeout: 5000, position: 'right'}),
    SocketIoModule.forRoot(config)
  ],
  providers: [
    AppConfig,{
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig],
      multi:true
    },
    ErrorListService,
    SocketIOService,
    WebloginService,
    MuleChartService,
    AllServerStateService,
    AuthGuard,
    guard,
    CookieService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorPageComponent,MuleDetailsComponent,Mule2DetailsComponent]
})

export class AppModule { }
