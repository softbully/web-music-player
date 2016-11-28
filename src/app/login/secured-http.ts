import { Http } from '@angular/http';

export abstract class SecuredHttp extends Http
{
    abstract setAuthorizationToken(token: string): void;
}