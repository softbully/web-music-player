import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { LibraryItem } from './library-item';
import 'rxjs/add/operator/mergeMap';
/**
 * Library Service
 */
@Injectable()
export class LibraryService {

  constructor(private http: Http) { }

  loadArtists(): Observable<LibraryItem> {
    let url: string = '/Artists/';

    return this.http.get(url)
      .flatMap((response) => { return response.json() })
      .map((item: LibraryItem) => {
        item.parent = 'artist';
        return item;
      })
  }

  loadAlbums(): Observable<LibraryItem> {
    let url: string = '/Albums/';

    return this.http.get(url)
      .flatMap((response) => response.json())
      .map((item: LibraryItem) => {
        item.parent = 'album'
        return item;
      })
  }

  loadAlbumsArtist(artistId: number): Observable<LibraryItem> {
    let url: string = '/Artists/' + artistId + '/Albums/';

    return this.http.get(url)
      .flatMap((albums) => albums.json())
      .map((item: LibraryItem) => {
        item.parent = 'artist-album';
        item.parentId = artistId;
        return item;
      });
  }

  loadAllSongs(): Observable<LibraryItem> {
    let url: string = '/Songs/';

    return this.http.get(url)
      .flatMap((songs) => songs.json());
  }

  loadSongsArtistAlbum(artistId: number, albumId: number): Observable<LibraryItem> {
    let url: string = '/Artists/' + artistId + '/Albums/' + albumId + '/Songs/';

    return this.http.get(url)
      .flatMap((songs) => songs.json());
  }

  loadSongsAlbum(albumId: number): Observable<LibraryItem> {
    let url: string = '/Albums/' + albumId + '/Songs/';

    return this.http.get(url)
      .flatMap((songs) => songs.json());
  }

  loadSongsArtist(artistId: number): Observable<LibraryItem> {
    let url: string = '/Artists/' + artistId + '/Songs/';

    return this.http.get(url)
      .flatMap((songs) => songs.json());
  }
}