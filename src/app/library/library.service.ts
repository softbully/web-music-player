import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { LibraryItem } from './library-item';

/**
 * Library Service
 */
@Injectable()
export class LibraryService {

  constructor(private http: Http) { }

  loadArtists(): Observable<LibraryItem[]> {
    let url: string = '/Artists/';

    return this.http.get(url)
      .map((libraryItem) => libraryItem.json())
      .map((entry) => {
        entry.parent = 'artist';
        return entry;
      })
  }

  loadAlbums(): Observable<LibraryItem[]> {
    let url: string = '/Albums/';

    return this.http.get(url)
      .map((libraryItem) => libraryItem.json())
      .map((entry) => {
        entry.parent = 'album'
        return entry;
      })
  }

  loadAlbumsArtist(artistId: number): Observable<LibraryItem[]> {
    let url: string = '/Artists/' + artistId + '/Albums/';

    return this.http.get(url)
      .map((albums) => albums.json())
      .map((entry) => {
        entry.parent = 'artist-album';
        entry.parentId = artistId;
        return entry;
      });
  }

  loadAllSongs(): Observable<LibraryItem[]> {
    let url: string = '/Songs/';

    return this.http.get(url)
      .map((songs) => songs.json());
  }

  loadSongsArtistAlbum(artistId: number, albumId: number): Observable<LibraryItem[]> {
    let url: string = '/Artists/' + artistId + '/Albums/' + albumId + '/Songs/';

    return this.http.get(url)
      .map((songs) => songs.json());
  }

  loadSongsAlbum(albumId: number): Observable<LibraryItem[]> {
    let url: string = '/Albums/' + albumId + '/Songs/';

    return this.http.get(url)
      .map((songs) => songs.json());
  }

  loadSongsArtist(artistId: number): Observable<LibraryItem[]> {
    let url: string = '/Artists/' + artistId + '/Songs/';

    return this.http.get(url)
      .map((songs) => songs.json());
  }
}