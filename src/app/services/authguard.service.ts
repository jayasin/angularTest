import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AuthGaurd implements CanActivate {

    constructor(private router: Router) {}

    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if(this.isUserLoggedIn() && state.url=="/users") {
            return true
        } else {
            this.router.navigateByUrl("/login")
            return false;
        }




    }

    /* Authentication backend goes here */
    isUserLoggedIn() {
        return localStorage.getItem('token') ? true : false;
    }
}