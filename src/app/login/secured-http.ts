import { Http } from '@angular/http';

export abstract class SecuredHttp extends Http
{
    authorizationToken: String;
}