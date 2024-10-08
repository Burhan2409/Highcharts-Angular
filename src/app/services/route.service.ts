import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MovieData } from '../interface/movie';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http: HttpClient) { }

  getMovies() : Observable<MovieData[]>
  {
    return this.http.get<MovieData[]>("https://localhost:44333/MovieData");
  }
}
