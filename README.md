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


### admin-dashboard.component.html

    <h1>Admin Dashboard</h1>
    <h3>Id : <b>{{admin.id}}</b> </h3>
    <h3>Name : <b>{{admin.name}}</b> </h3>
    <h3>Username : <b>{{admin.username}}</b> </h3>
    <button (click)="onLogout()">Logout</button>

### student-dashboard.component.ts

    import { HttpClient } from '@angular/common/http';
    import { Component, OnInit } from '@angular/core';
    import { Router } from '@angular/router';
    import { StudentUser } from './StudentUser/student-user';

    @Component({
        selector: 'app-student-dashboard',
        templateUrl: './student-dashboard.component.html',
        styleUrls: ['./student-dashboard.component.css']
    })
    export class StudentDashboardComponent implements OnInit {

        constructor(private http: HttpClient, private router: Router) {}

        student : any = new StudentUser();
        isAuthenticated : boolean = false;

        ngOnInit(): void {
            this.http.get('http://localhost:9898/user', { withCredentials: true }).subscribe({
                next : (response : any) => {
                console.log("Remember Me - Authenticated -> "+response.authenticated);
                this.student = response.user;
                this.isAuthenticated = response.authenticated;
            },

            error : (error : any) => {
              console.log("Remember Me -> "+error.authenticated);
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
                        this.deleteAllCookies();

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

### student-dashboard.component.html

      <h1>Student Dashboard</h1>
      <h3>Id : <b>{{student.id}}</b> </h3>
      <h3>Name : <b>{{student.name}}</b> </h3>
      <h3>Username : <b>{{student.username}}</b> </h3>
      <button (click)="onLogout()">Logout</button>

## login.component.ts

      import { HttpClient } from '@angular/common/http';
      import { Component } from '@angular/core';
      import { Router } from '@angular/router';
      import { LoginRequest } from './login-request';

      @Component({
          selector: 'app-login',
          templateUrl: './login.component.html',
          styleUrls: ['./login.component.css']
      })
      export class LoginComponent {

          username: string = '';
          password: string = '';
          rememberMe : boolean = false;
          errorMessage: string = '';

          constructor(private http: HttpClient, private router: Router) {}

          loginData : any = new LoginRequest(false);

          login(loginTemp : any) {

                const formData = new FormData();
                formData.append("username", this.loginData.username);
                formData.append("password", this.loginData.password);
                formData.append("remember-me", this.loginData.rememberMe.toString());

                console.log("Login Data : -> "+this.loginData.username + '-' + this.loginData.password + '-' + this.loginData.rememberMe);
                this.http.post('http://localhost:9898/login', formData, { withCredentials: true })
                    .subscribe({
                          next: (response : any) => {
                          console.log("RedirectUrl -> " + response.redirectUrl);
                          console.log("User Role -> " + response.role);
                          console.log("Username -> " + response.username)
                          localStorage.setItem('userRole', response.role); // Store role
                          this.router.navigate([response.redirectUrl]); // Redirect user
                    },
                    error: (error) => {
                          this.errorMessage = "Invalid username or password";
                          console.log(error.error.message)
                          console.log(error)
                          console.log(this.loginData.username+' '+this.loginData.password);
                    }
                });
          }
    }

## login.component.html

    <div class="login-container">
      <h2>Login</h2>
      <form #languageform="ngForm" (ngSubmit)="login(languageform)">
          <label>Username:</label>
          <input type="text" name="username" [(ngModel)]="loginData.username" #username="ngModel">
  
          <label>Password:</label>
          <input type="password" name="password" [(ngModel)]="loginData.password" #password="ngModel">

          <label>Remember Me:</label>
          <input type="checkbox" name="rememberMe" [(ngModel)]="loginData.rememberMe" #rememberMe="ngModel">
  
          <button type="submit">Login</button>
      </form>
  
      <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
    </div>

## login.component.ts

    .login-container {
        width: 300px;
        margin: auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        text-align: center;
    }
  
    input {
        width: 100%;
        padding: 8px;
        margin: 5px 0;
    }
  
    button {
        width: 100%;
        padding: 10px;
        background-color: blue;
        color: white;
        border: none;
        cursor: pointer;
    }
  
    .error {
      color: red;
      margin-top: 10px;
    }

## Generate three classes AdminUser, StudentUser and LoginRequest - which will be used to send request data

    export class LoginRequest {
        username! : string ;
        password! : string ;
        rememberMe!: boolean;

        constructor(rememberMe : any) {
            this.rememberMe = rememberMe;
        }
    }

    export class AdminUser {
        id!: number;
        name!: string;
        username!: string;
    }

    export class StudentUser {
        id!: number;
        name!: string;
        username!: string;
    }


# Create Auth-Guard so that no one can directly access without Authentication -- StudentDashboard and Admin Dashboard

## auth-guard.service.ts

    import { Injectable } from '@angular/core';
    import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
    import { Observable } from 'rxjs';

    @Injectable({
      providedIn: 'root'
    })
    export class AuthGuardService implements CanActivate {

      constructor(private router : Router) { }

      canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
          const userRole = localStorage.getItem('userRole'); // Get stored role
          const allowedRoles : any = route.data['roles'] as string[];
          console.log(allowedRoles);
          if (allowedRoles.includes(userRole)) {
              return true; // User has permission
          } else {
              this.router.navigate(['/login']); // Redirect to login
              return false;
          }
      }
    }



