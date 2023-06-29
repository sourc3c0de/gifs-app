import { Gif, SearchResponse } from './../interfaces/gifs.interfaces';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  constructor(
    private http: HttpClient,
  ) {
    this.loadLocalStorage();


  }

  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'A8G7x6auuBcFrlL1iQf1CQIWHoWl7oV2';
  private _tagsHistory: string[] = [];
  private _gifList: Gif[] = [];

  get tagsHistory() {
    return [ ...this._tagsHistory ];
  }

  get gifList() {
    return [ ...this._gifList ];
  }

  private organizeHistory( tag: string) {
    tag = tag.toLowerCase();

    if ( this._tagsHistory.includes(tag) ) {
      this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag );
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.slice(0, 15);
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('tagsHistory', JSON.stringify(this._tagsHistory));
  };

  private loadLocalStorage(): void {
    if ( !localStorage.getItem('tagsHistory') ) return;
    this._tagsHistory = JSON.parse( localStorage.getItem('tagsHistory')! );

    if ( this._tagsHistory.length === 0) return;
    this.searchTag( this._tagsHistory[0] );
  }

  searchTag( tag: string ): void {
    if ( tag.length === 0 ) return;

    this.organizeHistory( tag );

    const params = new HttpParams()
      .set('api_key', this.apiKey )
      .set('limit', '10' )
      .set('q', tag );

    this.http.get<SearchResponse>( `${ this.serviceUrl }/search`, { params } )
      .subscribe( resp => {
        this._gifList = resp.data;
      })
  }
}
