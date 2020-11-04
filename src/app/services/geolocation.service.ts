import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Country, State, City } from '../models/geolocation';
import { GlobalService } from '../global/app.global.service';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  constructor(private http: HttpClient, private global: GlobalService) { }

  getCountries(searchString): Observable<HttpResponse<Country[]>> {
    let Url = this.global.getCountriesUrl;
    Url = Url.replace('{search_string}', searchString);
    console.log(Url);
    return this.http.get<Country[]>(Url, { observe: 'response' });
  }

  getStates(searchString, countryId): Observable<HttpResponse<State[]>> {
    let Url = this.global.getStatesUrl;
    Url = Url.replace('{search_string}', searchString);
    Url = Url.replace('{country_id}', countryId);
    return this.http.get<State[]>(Url, { observe: 'response' });
  }

  getCities(searchString, stateId): Observable<HttpResponse<City[]>> {
    let Url = this.global.getCitiesUrl;
    Url = Url.replace('{search_string}', searchString);
    Url = Url.replace('{state_id}', stateId);
    return this.http.get<City[]>(Url, { observe: 'response' });
  }

}