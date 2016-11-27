import
{
    fakeAsync,
    inject,
    TestBed,
    tick,
    async
} from '@angular/core/testing';
import
{
    HttpModule,
    ConnectionBackend,
    XHRBackend,
    ResponseOptions,
    Response,
    RequestMethod,
    Http,
    Headers,
    Request,
    RequestOptions,
    RequestOptionsArgs
} from '@angular/http';
import
{
    MockBackend,
    MockConnection
} from '@angular/http/testing/mock_backend';

import { Observable } from 'rxjs/Observable';

/* from HttpModule */
import { BrowserXhr, BaseRequestOptions, BaseResponseOptions, XSRFStrategy, CookieXSRFStrategy } from '@angular/http';

export function _createDefaultCookieXSRFStrategy()
{
    return new CookieXSRFStrategy();
}

export function httpFactory(xhrBackend, requestOptions)
{
    return new MockSecuredHttpService(xhrBackend, requestOptions);
}

/**
 * Unit test for LoginService
 */
import { LoginService } from './login.service';
import { SecuredHttp } from './secured-http';


export class MockSecuredHttpService extends Http implements SecuredHttp
{
    authorizationToken: string;
}

describe('Login Service', () =>
{
    beforeEach(() =>
    {
        TestBed.configureTestingModule({
            providers: [
                { provide: SecuredHttp, useFactory: httpFactory, deps: [XHRBackend, RequestOptions] },
                BrowserXhr,
                { provide: RequestOptions, useClass: BaseRequestOptions },
                { provide: ResponseOptions, useClass: BaseResponseOptions },
                XHRBackend,
                { provide: XSRFStrategy, useFactory: _createDefaultCookieXSRFStrategy },
                {
                    provide: XHRBackend,
                    useClass: MockBackend
                },
                {
                    provide: ConnectionBackend,
                    useClass: MockBackend
                },
                LoginService
            ]
        });
    });

    it(`should set authoriation header`, fakeAsync(
        inject([
            XHRBackend,
            LoginService
        ], (mockBackend: MockBackend, loginService: LoginService) =>
            {
                let serverCalled: boolean = false

                mockBackend.connections.subscribe(
                    (connection: MockConnection) =>
                    {
                        serverCalled = true;

                        expect(connection.request.headers.get('Authorization')).toBe("user:xxx");
                        connection.mockRespond(new Response(new ResponseOptions({ body: ['xxx'] })));
                    });


                loginService.login(
                    'user',
                    'xxx',
                    () => { },
                    () => { throw Error('Unkown login service error') }
                );

                expect(serverCalled).toEqual(true);
            })
    ));

    it(`should set authoriation token on Secured Http Service`, fakeAsync(
        inject([
            XHRBackend,
            LoginService,
            SecuredHttp
        ], (
            mockBackend: MockBackend,
            loginService: LoginService,
            securedHttpService: SecuredHttp) =>
            {
                let expectedToken = "any-token";

                expect(securedHttpService).not.toBeNull();
                expect(securedHttpService.authorizationToken).toBeUndefined();

                let serverCalled: boolean = false

                mockBackend.connections.subscribe(
                    (connection: MockConnection) =>
                    {
                        serverCalled = true;

                        let reponse = [
                            { token: expectedToken }
                        ];

                        connection.mockRespond(new Response(new ResponseOptions({ body: reponse })));
                    });
                
                loginService.login(
                    '',
                    '',
                    () => { },
                    () => { throw Error('Unkown login service error') }
                );
                
                expect(securedHttpService.authorizationToken).toBe(expectedToken);
                expect(serverCalled).toEqual(true);
            })
    ));

});