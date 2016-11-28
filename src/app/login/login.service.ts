import { Injectable } from '@angular/core'
import { Response, Http, Headers, RequestOptions } from '@angular/http';

import '../rxjs-operators';

import { SecuredHttp } from './secured-http';
import { Account } from './account';

/**
 * Login Service
 */
@Injectable()
export class LoginService
{
    loggedIn: boolean;
    token: string;

    constructor(private http: SecuredHttp) { }

    public login(
        user: string,
        password: string,
        success: (token: string) => void,
        error: () => void)
    {
        let headers = new Headers({ 'Authorization': user + ":" + password });
        let options = new RequestOptions({ headers: headers });

        return this.http.get("http://api.kitee.ca/" + "Authorizations", options)
            .map((data) => data.json())
            .catch(null)
            .subscribe((data: Account[]) =>
            {
                this.loggedIn = true;
                this.token = data[0].token;
                this.http.setAuthorizationToken(this.token);
                
                success(this.token);
            });
    }
}