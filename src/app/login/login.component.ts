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

  loginData = new LoginRequest();

  login(loginTemp : any) {
    console.log("Login Data : -> "+this.loginData.username + '-' + this.loginData.password + '-' + this.loginData.rememberMe);
    this.http.post('http://localhost:9898/login', this.loginData, { withCredentials: true })
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
