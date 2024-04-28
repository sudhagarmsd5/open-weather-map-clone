import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";
import { SearchCity, Weather } from "../types/location.type";

@Injectable({
    providedIn: 'root',
})

export class ApiService {

    readonly #http: HttpClient = inject(HttpClient,);

    fetchWeatherDetails(params: Weather) {
        return this.#http.get<Weather>(`${environment.weather_api}?lat=${params.lat}&lon=${params.lon}&appid=${environment.api_key}`)
    }

    searchLocationDetails(params: SearchCity) {
        return this.#http.get<SearchCity>(`${environment.find_api}?q=${params.q}&units=${params.units}&appid=${environment.api_key}`)
    }
}