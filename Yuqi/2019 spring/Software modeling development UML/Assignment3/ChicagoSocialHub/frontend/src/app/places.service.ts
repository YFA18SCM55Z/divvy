////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';



import { Observable, of } from 'rxjs';
import { catchError, map, tap, zip } from 'rxjs/operators';


import { Place } from './place';
import { Station } from './station';





const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) { 
 

  }


  getPlaces() : Observable<Place[]> {
    return this.http.get<Place[]>(`${this.uri}/places`);
  }
 

  getPlaceSelected() {
    return this.http.get(`${this.uri}/place_selected`);
  }


  getStations() {
    return this.http.get(`${this.uri}/stations`);
  }

  getSelectedStation() {
    //console.log('calling')
    return this.http.get(`${this.uri}/stations/selected`);
  }


  findPlaces(find, where) {
    const find_places_at = {
      find: find,
      where: where
    };

    return this.http.post(`${this.uri}/places/find`, find_places_at, httpOptions);

  }

 


  findStations(placeName) {
    const find_stations_at = {
      placeName: placeName
    };

    var str = JSON.stringify(find_stations_at, null, 2);


    return this.http.post(`${this.uri}/stations/find`, find_stations_at, httpOptions);

  }

  findSelectedStations(id) {
    const find_selected_stations = {
      id: id
    };

    //console.log("find selected stations",id)
    var str = JSON.stringify(find_selected_stations, null, 2);

    return this.http.post(`${this.uri}/stations/selected`, find_selected_stations, httpOptions);
  }

  findSelectedStationsTwentyFourHour(id) {
    const find_selected_stations = {
      id: id
    };

    //console.log("find selected stations",id)
    var str = JSON.stringify(find_selected_stations, null, 2);

    return this.http.post(`${this.uri}/stations/selected_twenty_four_hour`, find_selected_stations, httpOptions);
  }

  findSelectedStationsSevenDay(id) {
    const find_selected_stations = {
      id: id
    };

    //console.log("find selected stations",id)
    var str = JSON.stringify(find_selected_stations, null, 2);

    return this.http.post(`${this.uri}/stations/selected_seven_day`, find_selected_stations, httpOptions);
  }

}
