import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { GlobalService } from '../global/app.global.service';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthenticationService{
    public currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;

    constructor(private http: HttpClient, private global:GlobalService, private router: Router ){
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }


    login(objUser: any): Observable<HttpResponse<any>> {
        return this.http.post<any>(this.global.loginUrl, objUser, { observe: 'response' });
    }

    logout(){
        localStorage.removeItem('currentUser');
        localStorage.clear();
        this.currentUserSubject.next(null);
        this.router.navigateByUrl('/');
    }

    changePassword(body): Observable<HttpResponse<any>> {
        let Url = this.global.changePassword;
        console.log(Url);
        return this.http.post<any>(Url,body,{ observe: 'response' });
    }

    refreshToken(): Observable<HttpResponse<any>>{
        return this.http.get<any>(this.global.refreshTokenUrl, {observe: 'response'});
    }

    forgotPassword(body):Observable<HttpResponse<any>> {
        let url = this.global.forgotPassword + body
        return this.http.get<any>(url, {observe: 'response'});
    
    }

}