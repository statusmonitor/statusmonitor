import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './frontend/Body/details/details.component';
import { BodyMainComponent } from './frontend/Body/body-main/body-main.component';
import { ErrorPageComponent } from './frontend/Body/error-page/error-page.component';
import { AppComponent } from './app.component';
import { AuthGuard } from './guard/auth.guard';
import { LoginComponent } from './frontend/login/login.component';
import { LoginSuccessComponent } from './frontend/login/login-success/login-success.component';


const routes: Routes = [
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'main',
    canActivate:[AuthGuard],
    component:BodyMainComponent 
  },
  {
    path:'details',
    canActivate:[AuthGuard],
    component:DetailsComponent
  },
  {
    path:'error',
    canActivate:[AuthGuard],
    component:ErrorPageComponent
  },
  {
    path:'app',
    canActivate:[AuthGuard],
    component:AppComponent
  },
  {
    path:'loginSuccess',
    component:LoginSuccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
