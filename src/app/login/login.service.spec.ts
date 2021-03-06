import {
    fakeAsync,
    inject,
    TestBed
} from '@angular/core/testing';
import {
    ConnectionBackend,
    XHRBackend,
    ResponseOptions,
    Response,
    Http,
    RequestOptions,
    BaseRequestOptions
} from '@angular/http';
import {
    MockBackend,
    MockConnection
} from '@angular/http/testing/mock_backend';

import { Observable } from 'rxjs/Observable';

/**
 * Unit test for LoginService
 */
import { LoginService } from './login.service';
import { SecuredHttp } from './secured-http';


export class MockSecuredHttpService extends Http implements SecuredHttp {
    authorizationToken: string;

    setAuthorizationToken(token: string): void {
        this.authorizationToken = token;
    };
}

describe('Login Service', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: SecuredHttp,
                    useClass: MockSecuredHttpService,
                    deps: [XHRBackend, RequestOptions]
                },
                {
                    provide: RequestOptions,
                    useClass: BaseRequestOptions
                },
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

    it(`should set authoriation header on login (/Authorizations) server call`, fakeAsync(
        inject([
            XHRBackend,
            LoginService
        ], (mockBackend: MockBackend, loginService: LoginService) => {
            let serverCalled: boolean = false

            mockBackend.connections.subscribe(
                (connection: MockConnection) => {
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
            securedHttpService: SecuredHttp) => {
                let expectedToken = "any-token";
                
                spyOn(securedHttpService, 'setAuthorizationToken');

                mockBackend.connections.subscribe(
                    (connection: MockConnection) => {
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

                expect(securedHttpService.setAuthorizationToken).toHaveBeenCalledWith(expectedToken);
            })
    ));
});