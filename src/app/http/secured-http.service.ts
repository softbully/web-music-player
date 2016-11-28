import { Injectable } from '@angular/core';
import { Http, XHRBackend, Request } from '@angular/http';
import { Headers, RequestOptions, RequestOptionsArgs, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

/**
 * This injectable service will intercept every http request and add an authorizarion token to it's header.
 * 
 * It will work for the 'get', 'post', 'put', 'delete', 'patch' and 'head' methods.
 * It will not work for a direct 'request' method call.
 */
@Injectable()
export class SecuredHttpService extends Http {
    static authorizationToken: string = 'no-token-set';

    constructor(backend: XHRBackend, options: RequestOptions) {
        super(backend, options);
    }

    public setAuthorizationToken(token: string) {
        SecuredHttpService.authorizationToken = token;
    }

    private addAuthorizationHeader(request: Request): Request {
        request.headers.append('Authorization', SecuredHttpService.authorizationToken);
        return request;
    }

    request(url: Request, options?: RequestOptionsArgs): Observable<Response> {
        if (!(url instanceof Request)) {
            throw Error('Calling request with the first parameter as a string url is not supported.');
        }

        return super.request(this.addAuthorizationHeader(url), options);
    }
}