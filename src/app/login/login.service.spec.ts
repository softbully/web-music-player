import
{
    fakeAsync,
    inject,
    TestBed
} from '@angular/core/testing';
import
{
    ConnectionBackend,
    XHRBackend,
    ResponseOptions,
    Response,
    Http,
    RequestOptions,
    BaseRequestOptions
} from '@angular/http';
import
{
    MockBackend,
    MockConnection
} from '@angular/http/testing/mock_backend';

import { Observable } from 'rxjs/Observable';

/**
 * Unit test for LoginService
 */
import { LoginService } from './login.service';
import { SecuredHttp } from './secured-http';


export class MockSecuredHttpService extends Http implements SecuredHttp
{
    authorizationToken: string;
}

export function httpFactory(xhrBackend, requestOptions)
{
    return new MockSecuredHttpService(xhrBackend, requestOptions);
}

describe('Login Service', () =>
{
    beforeEach(() =>
    {
        TestBed.configureTestingModule({
            providers: [
                { provide: SecuredHttp, 
                    useFactory: httpFactory, 
                    deps: [XHRBackend, RequestOptions] },
                { 
                    provide: RequestOptions, 
                    useClass: BaseRequestOptions },
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

    it(`should set authoriation header on Authorizations server call`, fakeAsync(
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