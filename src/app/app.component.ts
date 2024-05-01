import { Component, ElementRef, OnInit, Renderer2, ViewChild, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { ButtonComponent, InputComponent, } from "@ui/components";
import { SearchCity, Units, Weather } from './types/location.type';
import { UtilService } from './utils/util';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InputComponent, ButtonComponent],
  template: `
    <section class="px-2 py-5 bg-light-gray-two">
      <div class="grid grid-cols-2 md:grid-cols-[5fr_4fr] gap-5">
        <div class="flex justify-center items-center w-full">
          <div class="relative">
            <ui-input [class]="'border bg-white outline-none py-1 w-96 indent-4 rounded-l-md'" type="text"
            [value]="searchCity()"
            (inputValueChange)="searchCity.set($event.target.value)"
            placeholder="Search city"
            ></ui-input>
            @if (searchReponse().length > 0){
              <div  class="absolute bg-white top-8 border-b rounded-b-md w-full">
                <ul #menu class="border space-y-4 cursor-pointer list-none p-1 ">
                  @for (item of searchReponse(); track $index) {
                    <li class="py-2 px-4 hover:bg-gray-100 rounded-md transition-colors duration-300" (click)="selectSearchItem(item)">
                    <div class="flex items-center">
                      {{item.name}}, {{item.sys.country}} 
                    <img class="ml-1 h-3" [src]="displayFlag(item)" />
                  </div>
                    </li>
                  }
                </ul>
              </div>
            }
          </div>
          <ui-button variant="plain" [class]="'text-white bg-gray-950 py-[5px] px-4 rounded-r-md'" label="Search" (click)="searchLocation()"></ui-button>
        </div>
        <div class="flex items-center justify-around">
          <div class="">
          <ui-button variant="icon" [class]="'h-6 w-full hover:bg-white rounded-sm'" [label]="'near_me'" (click)="currentLocation()"></ui-button>
          </div>
          <div class="">
            <div class="bg-light-gray-one flex w-64 p-1 rounded-md">
              <div class="w-1/2 text-center rounded-md cursor-pointer text-light-gray-three" [class]="unitType() == 'metric' ? 'bg-white':''" (click)="unitType.set('metric')">Metric: °C, m/s</div>
              <div class="w-1/2 text-center rounded-md cursor-pointer text-light-gray-three" [class]="unitType() == 'imperial' ? 'bg-white':''" (click)="unitType.set('imperial')">Imperial: °F, mph</div>
            </div>
          </div>
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
  #renderer = inject(Renderer2);
  @ViewChild('menu') menu!: ElementRef;

  constructor() {
    this.callWeatherApi()

    this.#renderer.listen('window', 'click', (e: Event) => {
      if (!this.menu?.nativeElement?.contains(e.target)) {
        this.searchReponse.set([])
      }
    })
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

  selectSearchItem(item: any) {
    console.log(item);

  }

  displayFlag(item: any) {
    let country: string = item.sys.country
    return `${environment.img_flags}${country.toLocaleLowerCase()}.png`
  }
}
