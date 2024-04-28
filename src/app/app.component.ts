import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { ButtonComponent, InputComponent, } from "@ui/components";
import { SearchCity, Units, Weather } from './types/location.type';
import { UtilService } from './utils/util';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InputComponent, ButtonComponent],
  template: `
    <section class="px-2 bg-gray-100">
      <div class="grid grid-cols-2 md:grid-cols-[5fr_4fr] gap-5">
        <div class="flex justify-center items-center w-full">
          <div class="relative">
            <ui-input [class]="'border bg-white outline-none py-1 w-96 indent-4 rounded-l-md'" type="text"
            [value]="searchCity()"
            (inputValueChange)="searchCity.set($event.target.value)"
            placeholder="Search city"
            ></ui-input>
            @if (searchReponse().length > 0){
              <div class="absolute bg-white top-6 border-b rounded-b-md w-full">
                <ul class="border space-y-4 cursor-pointer list-none">
                  @for (item of searchReponse(); track $index) {
                    <li class="py-2 px-4 hover:bg-gray-200 transition-colors duration-300">
                      {{item.name}}
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
          <ui-button variant="plain" [class]="'text-white bg-gray-950 py-[5px] px-4 rounded-r-md'" label="Search" (click)="searchLocation()"></ui-button>
        </div>
        <div class="flex">
          <div class="p-5">
          <ui-button variant="icon" [class]="'h-10 w-full'" [label]="'near_me'" (click)="currentLocation()"></ui-button>
          </div>
          <div class="p-5">2</div>
          <div class="p-5">2</div>
        </div>
      </div>
    </section>
  <div class="p-5">
  </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'open-weather-map-clone';
  searchCity = signal<string>('');
  unitType = signal<Units>('metric');
  searchReponse = signal<any[]>([]);
  readonly #apiService = inject(ApiService);
  readonly #utilService = inject(UtilService);

  constructor() {
    this.callWeatherApi()

    effect(() => {
      if (this.searchCity())
        this.searchReponse.set([])
    }, { allowSignalWrites: true })
  }

  ngOnInit(): void {


  }

  callWeatherApi() {
    // call weather api 
    const location = this.#utilService.checkLocationDetails()

    location.then((res) => {
      const state = res.state

      if (state == 'granted') {
        try {
          const { latitude, longitude } = this.#utilService.getUserLocationDetails()
          this.getWeatherDetails({ lat: latitude, lon: longitude, units: this.unitType() })
        } catch (error) {
          this.getWeatherDetails({ lat: "20", lon: "77", units: this.unitType() })
        }
      } else {
        this.getWeatherDetails({ lat: "20", lon: "77", units: this.unitType() })
      }
    })
  }

  currentLocation() {
    this.#utilService.getCurrentLocation().then((res: any) => {
      this.#utilService.setUserLocationDetails({ latitude: res.coords.latitude, longitude: res.coords.longitude })
    })
  }

  getWeatherDetails(param: Weather) {
    let params: Weather = {
      lat: param.lat,
      lon: param.lon,
      units: param.units,
    }
    this.#apiService.fetchWeatherDetails(params).subscribe({
      next(value) {
        console.log(value);
      },
    })
  }

  getCityDetails(param: SearchCity) {
    let params: SearchCity = {
      q: param.q,
      units: param.units
    }
    this.#apiService.searchLocationDetails(params).subscribe({
      next: (value: any) => {
        this.searchReponse.set(value.list)
      }
    })
  }

  searchLocation() {
    if (this.searchCity())
      this.getCityDetails({ q: this.searchCity(), units: this.unitType() })
  }
}
