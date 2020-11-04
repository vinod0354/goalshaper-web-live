import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { GlobalService } from '../global/app.global.service';

@Injectable({providedIn: 'root'})
export class UserService {
    constructor(private http: HttpClient, private global: GlobalService) {}

    getUserRoles(): Observable<HttpResponse<any[]>> {
		return this.http.get<any[]>(this.global.userRolesUrl, { observe: 'response' });
    }

    createUser(userBody:any): Observable<HttpResponse<any>>{
        return this.http.post<any>(this.global.createUserUrl, userBody,{observe: 'response'});
    }

    updateUser(user_id, userBody: any): Observable<HttpResponse<any>>{
        let url = this.global.updateUserUrl;
        url = url.replace('{user_id}', user_id);
        return this.http.put<any>(url, userBody,{observe: 'response'});
    }

    getUsers(enterprise_id, role_id, pageNumber, pageSize, sortColumn, sortOrder): Observable<HttpResponse<any[]>> {
        let url = this.global.getUsersUrl;
        url = url.replace('{enterprise_id}', enterprise_id);
        url = url.replace('{role_id}', role_id);
        url = url.replace('{pageNumber}', pageNumber);
        url = url.replace('{pageSize}', pageSize);
        url = url.replace('{sortColumn}', sortColumn);
        url = url.replace('{sortOrder}', sortOrder);

		return this.http.get<any[]>(url, { observe: 'response' });
    }

    getallUsers(enterprise_id, role_id): Observable<HttpResponse<any[]>> {
        let url = this.global.allUsersUrl;
        url = url.replace('{enterprise_id}', enterprise_id);
        url = url.replace('{role_id}', role_id);

        return this.http.get<any[]>(url, { observe: 'response' });
    }

    deleteUser(user_id): Observable<HttpResponse<any>>{
        let url = this.global.deleteUserUrl;
        url = url.replace('{user_id}', user_id);
        return this.http.delete<any>(url, { observe: 'response' });
    }

    createUserLog(logData): Observable<HttpResponse<any>>{
        let url = this.global.userLogsUrl;
        console.log(url);
        return this.http.post<any>(url,logData, { observe: 'response' });
    }
}