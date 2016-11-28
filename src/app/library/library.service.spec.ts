import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing/mock_backend';
import { Http, XHRBackend, ConnectionBackend, RequestOptions, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';

import { LibraryService } from './library.service';
import { SecuredHttpService } from '../http/secured-http.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

// Tests
// load all artists                            /Artists              
// load all albums from artist                 /Artists/Albums
// load all songs from artist                  /Artists/Songs
// load all songs from album from artists      /Artists/Albums/Songs
// load all albums                             /Albums
// load all songs form albums                  /Albums/Songs
// load all Songs                              /Songs

/**
 * Unit test for LibraryService
 */
describe('Library Service', () => {

  let myLibraryService: LibraryService;
  let myLibraryTester: LibraryTester;

  beforeEach(
    () => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: Http,
            useClass: Http,
            deps: [XHRBackend, RequestOptions]
          },
          LibraryService,
          {
            provide: ConnectionBackend,
            useClass: MockBackend
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
            provide: LibraryTester,
            useClass: LibraryTester,
            deps: [LibraryService, XHRBackend]
          }
        ]
      });
    }
  );

  beforeEach(inject([
    XHRBackend,
    LibraryService,
  ], (mockBackEnd: MockBackend, libraryService: LibraryService) => {
    myLibraryService = libraryService;
    myLibraryTester = new LibraryTester(libraryService, mockBackEnd);
  }));

  it(`should load all artists`, fakeAsync(() => {
    let expectedRequestUrl: string = '/Artists/';

    let actualRequestUrl = myLibraryTester.getActualUrlForMethod(myLibraryService.loadArtists);
    expect(actualRequestUrl).toEqual(expectedRequestUrl);
  }));

  it(`should load all albums from an artists`, fakeAsync(() => {
    let expectedRequestUrl: string = '/Artists/25/Albums/';
    let actualRequestUrl = myLibraryTester.getActualUrlForMethod(myLibraryService.loadAlbumsArtist, 25);

    expect(actualRequestUrl).toEqual(expectedRequestUrl);
  }));

  it(`should load all songs an artists`, fakeAsync(() => {
    let expectedRequestUrl: string = '/Artists/25/Songs/';
    let actualRequestUrl = myLibraryTester.getActualUrlForMethod(myLibraryService.loadSongsArtist, 25);

    expect(actualRequestUrl).toEqual(expectedRequestUrl);
  }));

  it(`should load all songs from an albums from an artists`, fakeAsync(() => {
    let expectedRequestUrl: string = '/Artists/25/Albums/50/Songs/';
    let actualRequestUrl = myLibraryTester.getActualUrlForMethod(myLibraryService.loadSongsArtistAlbum, 25, 50);

    expect(actualRequestUrl).toEqual(expectedRequestUrl);
  }));

  it(`should load all Albums`, fakeAsync(() => {
    let expectedRequestUrl: string = '/Albums/';

    let actualRequestUrl = myLibraryTester.getActualUrlForMethod(myLibraryService.loadAlbums);
    expect(actualRequestUrl).toEqual(expectedRequestUrl);
  }));

  it(`should load all songs from an albums`, fakeAsync(() => {
    let expectedRequestUrl: string = '/Albums/25/Songs/';
    let actualRequestUrl = myLibraryTester.getActualUrlForMethod(myLibraryService.loadSongsAlbum, 25);

    expect(actualRequestUrl).toEqual(expectedRequestUrl);
  }));

  it(`should load all artists`, fakeAsync(() => {
    let expectedRequestUrl: string = '/Songs/';

    let actualRequestUrl = myLibraryTester.getActualUrlForMethod(myLibraryService.loadAllSongs);
    expect(actualRequestUrl).toEqual(expectedRequestUrl);
  }));
});

@Injectable()
class LibraryTester {

  constructor(
    private libraryService: LibraryService,
    private mockBackEnd: MockBackend) { };

  getActualUrlForMethod(method: (...a: any[]) => Observable<any>, ...params: number[]) {

    let expectedRequestUrl: string = '/Songs/';
    let actualRequesyUrl: string;

    this.mockBackEnd.connections.subscribe(
      (connection: MockConnection) => {
        actualRequesyUrl = connection.request.url;
      });

    method.apply(this.libraryService, params);

    return actualRequesyUrl;
  }
}