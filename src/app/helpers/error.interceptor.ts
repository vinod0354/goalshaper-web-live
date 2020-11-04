import { Injectable,  } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
    constructor(private authenticationService: AuthenticationService, private route: Router){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        return next.handle(request).pipe(catchError(err => {
            if(err.status === 401 || err.status == 403){
                console.log('Error Block Occured');

                console.log(this.route.url);
                console.log('Current URL');

                if(this.route.url != '/login'){
                    // auto logout if 401 response returned from api
                    this.authenticationService.logout();
                    location.reload(true);
                }
            }
            return throwError(err);
        }))
    }
}