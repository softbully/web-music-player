import
{
    fakeAsync,
    inject,
    TestBed,
    async
} from '@angular/core/testing';
import
{
    HttpModule,
    XHRBackend,
    ResponseOptions,
    Response,
    RequestMethod,
    Http,
    Headers,
    Request
} from '@angular/http';
import
{
    MockBackend,
    MockConnection
} from '@angular/http/testing/mock_backend';

/**
 * Unit test for LoginService
 */
import { LoginService } from './login.service';

describe('Login Service', () =>
{

    beforeEach(() =>
    {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                {
                    provide: XHRBackend,
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
                mockBackend.connections.subscribe(
                    (connection: MockConnection) =>
                    {
                        expect(connection.request.headers.get('Authorization')).toBe("user:xxx");
                        connection.mockRespond(new Response(new ResponseOptions({ body: ['xxx'] })));
                    });

                loginService.login(
                    'user',
                    'xxx',
                    () => console.log('success'),
                    () => console.log('error')
                );
            })
    ));
});