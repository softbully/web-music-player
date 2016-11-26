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
    RequestMethod
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

//    it(`should set authoriation header`, fakeAsync(
//        inject([
//            XHRBackend,
//            LoginService
//        ], (mockBackend: XHRBackend, loginService: LoginService) =>
//            {
//            let mb: MockBackend = null;
//            mb.connections;
//            
//                mockBackend.connections.subscribe(
//                    (connection: MockConnection) =>
//                    {
//                        expect(connection.request.headers.get("Authorizarion")).toBe("user:xxx");
//                    });
//
//                loginService.login('user', 'xxx', null, null);
//
//            })
//    ));
});