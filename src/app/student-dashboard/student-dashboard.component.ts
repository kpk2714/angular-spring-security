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
