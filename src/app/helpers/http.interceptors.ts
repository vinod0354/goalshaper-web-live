import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpHeaders, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import sha1 from 'sha1';
import moment from 'moment';

@Injectable()
export class HttpInterceptors implements HttpInterceptor{
    public regularSecretKey: string = 'goalShaper_secretKey';
    constructor(private authenticationService: AuthenticationService){

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>{
        let currentUser = this.authenticationService.currentUserValue;
        var UTCDate = moment(new Date()).utc().format(); //'YYYY-MM-DD HH:mm:ss.SSS'
        var finalEpocTime = moment(UTCDate).unix();
        var keyCombination = this.regularSecretKey + finalEpocTime;
        var accessToken = sha1(keyCombination);



        if(currentUser && currentUser.token){
            request = request.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `${currentUser.token}@@${accessToken}`,
                    'timestamp': finalEpocTime.toString()
                })
            });
        }else{
            request = request.clone({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `${accessToken}`,
                    'timestamp': finalEpocTime.toString()
                })
            });
        }

        return next.handle(request);
    }
}