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
