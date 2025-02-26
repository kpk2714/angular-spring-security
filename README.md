# Angular Login Form and Remember-Me Implementation using Spring Security and MySQL

## app.module.ts

    import { NgModule } from '@angular/core';
    import { BrowserModule } from '@angular/platform-browser';
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
    import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
    import { LoginComponent } from './login/login.component';
    import { FormsModule } from '@angular/forms';
    import { HttpClientModule } from '@angular/common/http';

    @NgModule({
        declarations: [
          AppComponent,
          AdminDashboardComponent,
          StudentDashboardComponent,
          LoginComponent
        ],
      imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    
    export class AppModule { }

## app.component.ts

    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent {
      title = 'angular-spring-security';
    }

## app.component.html

    <router-outlet></router-outlet>

## app-routing.module.ts

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


## Create three different component inside src->app->admin-dashboard || src->app->student-dashboard || src->app->login

### admin-dashboard.component.ts

    import { HttpClient } from '@angular/common/http';
    import { Component, OnInit } from '@angular/core';
    import { Router } from '@angular/router';
    import { AdminUser } from './AdminUser/admin-user';

    @Component({
      selector: 'app-admin-dashboard',
      templateUrl: './admin-dashboard.component.html',
      styleUrls: ['./admin-dashboard.component.css']
    })
    export class AdminDashboardComponent implements OnInit {

    constructor(private http: HttpClient, private router: Router) {}

    admin : any = new AdminUser();
    isAuthenticated : boolean = false;

    ngOnInit(): void {
        this.http.get('http://localhost:9898/user', { withCredentials: true }).subscribe({
            next : (response : any) => {
              console.log("Remember Me -> "+response.authenticated);
              this.admin = response.user;
              this.isAuthenticated = response.authenticated;
            }, 

            error : (error : any) => {
              console.log("Remember Me -> "+error.authenticated);
              this.isAuthenticated = error.authenticated;
            }
        })
    }

    onLogout() {

      this.http.post('http://localhost:9898/auth/logout', {}, { withCredentials: true })
          .subscribe({
              next: () => {
                // Clear LocalStorage
                localStorage.removeItem('userRole');

                document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

                // Clear Cookies (Client-Side)
                //this.deleteAllCookies();

                // Redirect to Login Page
                this.router.navigate(['/login']);
              },
              error: (error) => {
                console.error('Logout failed:', error);
              }
          });
    }

    deleteAllCookies() {
        document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
      }
    }



