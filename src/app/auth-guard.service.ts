import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import {BackendService} from './backend.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private backendService: BackendService, private router: Router, private route: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.backendService.isAuthenticated() === true) {
      return true;
    } else {
      this.router.navigate(['/'], {relativeTo: this.route});
    }
  }
}
