import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import '../rxjs-operators';

import { Account } from './account';
/**
 * Login Service
 */
export class LoginService
{
    loggedIn: boolean;
    token: string;

    constructor(private http: Http) { }

    public login(
        user: string,
        password: string,
        success: (token: string) => void,
        error: () => void)
    {
        let headers = new Headers({ 'Authorization': user + ":" + password });
        let options = new RequestOptions({ headers: headers });

        return this.http.get("http://api.kitee.ca/" + "Authorizations")
            .map((data) => data.json())
            .catch(null)
            .subscribe((data: Account[]) =>
            {
                this.loggedIn = true;
                this.token = data[0].token;
                //    //TODO Use account id instead of token. Token will change.
                //    $http.defaults.headers.common.Authorization = token;
                success(this.token);
            });

    }
}