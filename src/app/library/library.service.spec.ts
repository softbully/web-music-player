import { fakeAsync, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing/mock_backend';
import { Http, XHRBackend, ConnectionBackend, RequestOptions, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';

import { LibraryService } from './library.service';
import { SecuredHttpService } from '../http/secured-http.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { LibraryItem } from './library-item';

/**
 * Unit test for LibraryService
 * 
 * Tests request url and parsed data for:
 * load all artists                            /Artists              
 * load all albums from artist                 /Artists/{id}/Albums
 * load all songs from artist                  /Artists/{id}/Songs
 * load all songs from album from artists      /Artists/{id}/Albums{id}/Songs
 * load all albums                             /Albums
 * load all songs form albums                  /Albums/{id}/Songs
 * load all Songs                              /Songs
 */

describe('Library Service', () => {

  let _libraryService: LibraryService;
  let _libraryTester: LibraryTester;

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
    _libraryService = libraryService;
    _libraryTester = new LibraryTester(libraryService, mockBackEnd);
  }));

  /*
   *  Test request urls
   */
  it(`should load all urls correctly`, fakeAsync(() => {
    expect(_libraryTester.getActualUrlForMethod(_libraryService.loadArtists))
      .toEqual('/Artists/');

    expect(_libraryTester.getActualUrlForMethod(_libraryService.loadAlbumsArtist, 25))
      .toEqual('/Artists/25/Albums/');

    expect(_libraryTester.getActualUrlForMethod(_libraryService.loadSongsArtist, 25))
      .toEqual('/Artists/25/Songs/');

    expect(_libraryTester.getActualUrlForMethod(_libraryService.loadSongsArtistAlbum, 25, 50))
      .toEqual('/Artists/25/Albums/50/Songs/');

    expect(_libraryTester.getActualUrlForMethod(_libraryService.loadAlbums))
      .toEqual('/Albums/');

    expect(_libraryTester.getActualUrlForMethod(_libraryService.loadSongsAlbum, 25))
      .toEqual('/Albums/25/Songs/');

    expect(_libraryTester.getActualUrlForMethod(_libraryService.loadAllSongs))
      .toEqual('/Songs/');
  }));

  /*
   *  Test request parsed data
   */
  it(`should parse all artists correctly`, fakeAsync(() => {
    expect(_libraryTester.getParsedResponse(_libraryService.loadArtists, mockArtists))
      .toEqual(expectedArtists);
  }));

  it(`should parse all songs from artists correctly`, fakeAsync(() => {
    expect(_libraryTester.getParsedResponse(_libraryService.loadSongsArtist, mockSongs))
      .toEqual(mockSongs);
  }));

  it(`should parse all albums from artist correctly`, fakeAsync(() => {
    expect(_libraryTester.getParsedResponse(_libraryService.loadAlbumsArtist, mockAlbums, 25))
      .toEqual(expectedArtistAlbums);
  }));

  it(`should parse all songs from albums from artist correctly`, fakeAsync(() => {
    expect(_libraryTester.getParsedResponse(_libraryService.loadSongsArtistAlbum, mockSongs))
      .toEqual(expectedSongs);
  }));

  it(`should parse albums correctly`, fakeAsync(() => {
    expect(_libraryTester.getParsedResponse(_libraryService.loadAlbums, mockAlbums))
      .toEqual(expectedAlbums);
  }));

  it(`should parse all songs from albums correctly`, fakeAsync(() => {
    expect(_libraryTester.getParsedResponse(_libraryService.loadSongsAlbum, mockSongs))
      .toEqual(expectedSongs);
  }));

  it(`should parse all songs correctly`, fakeAsync(() => {
    expect(_libraryTester.getParsedResponse(_libraryService.loadAllSongs, mockSongs))
      .toEqual(expectedSongs);
  }));
});

/*
 * Test helper class. used for checking request url and parsed data.
 */
@Injectable()
class LibraryTester {

  constructor(
    private libraryService: LibraryService,
    private mockBackEnd: MockBackend) { };

  getActualUrlForMethod(
    method: (...a: any[]) => Observable<any>,
    ...params: number[]) {
    let expectedRequestUrl: string = '/Songs/';
    let actualRequesyUrl: string;

    this.mockBackEnd.connections.subscribe(
      (connection: MockConnection) => {
        actualRequesyUrl = connection.request.url;
      });

    method.apply(this.libraryService, params);

    return actualRequesyUrl;
  }

  getParsedResponse(
    method: (...a: any[]) => Observable<any>,
    mockResponse: LibraryItem[],
    ...params: number[]): LibraryItem[] {
    let response: LibraryItem[] = [];

    this.mockBackEnd.connections.subscribe(
      (connection: MockConnection) => {
        connection.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
      });

    let observable: Observable<LibraryItem> = method.apply(this.libraryService, params);

    observable.subscribe((artists) => {
      response.push(artists);
    })

    return response;
  }
}

/*
 * Mocked data
 */
let mockArtists: LibraryItem[] = [
  { id: 0, name: 'The Beatles', path: '/Artists/0' },
  { id: 1, name: 'The Animals', path: '/Artists/1' },
  { id: 2, name: 'Elvis', path: '/Artists/2' }
];


let mockAlbums: LibraryItem[] = [
  { id: 0, name: 'White Album', path: '/Albums/0' },
  { id: 1, name: 'Abbey Road', path: '/Albums/1' },
  { id: 2, name: 'The Beft Of', path: '/Albums/2' }
];

let mockSongs: LibraryItem[] = [
  { id: 0, name: 'Rocky Raccon', path: '/Songs/0' },
  { id: 1, name: 'Something', path: '/Songs/1' },
  { id: 2, name: 'Don\'t Let Me Be Misundestood', path: '/Songs/2' }
];

let expectedArtists: LibraryItem[] = [
  { id: 0, name: 'The Beatles', path: '/Artists/0', parent: 'artist' },
  { id: 1, name: 'The Animals', path: '/Artists/1', parent: 'artist' },
  { id: 2, name: 'Elvis', path: '/Artists/2', parent: 'artist' }
];

let expectedAlbums: LibraryItem[] = [
  { id: 0, name: 'White Album', path: '/Albums/0', parent: 'album' },
  { id: 1, name: 'Abbey Road', path: '/Albums/1', parent: 'album' },
  { id: 2, name: 'The Beft Of', path: '/Albums/2', parent: 'album' }
];

let expectedArtistAlbums: LibraryItem[] = [
  { id: 0, name: 'White Album', path: '/Albums/0', parent: 'artist-album', parentId: 25 },
  { id: 1, name: 'Abbey Road', path: '/Albums/1', parent: 'artist-album', parentId: 25 },
  { id: 2, name: 'The Beft Of', path: '/Albums/2', parent: 'artist-album', parentId: 25 }
];

let expectedSongs: LibraryItem[] = mockSongs;
