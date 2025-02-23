import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard/auth-guard.service';

const routes: Routes = [
  { path : 'student-dashboard' , component : StudentDashboardComponent, canActivate : [AuthGuardService], data : { roles : ['ROLE_STUDENT']}},
  {path : 'admin-dashboard' , component : AdminDashboardComponent, canActivate: [AuthGuardService], data: { roles: ['ROLE_ADMIN'] }},

  {path : 'login',component : LoginComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
