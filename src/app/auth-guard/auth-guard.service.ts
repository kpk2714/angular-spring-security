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
