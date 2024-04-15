import { Component, OnInit, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent, InputComponent, } from "@ui/components";
import { debounce } from "lodash-es";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InputComponent, ButtonComponent],
  template: `
    <section class="px-2 bg-gray-100">
      <div class="grid grid-cols-2 md:grid-cols-[5fr_4fr] gap-5">
        <div class="flex justify-center items-center w-full">
          <ui-input [class]="'border bg-white outline-none py-1 w-96 indent-4 rounded-l-md'" type="text"
          [value]="searchCity()"
          (inputValueChange)="searchCity.set($event.target.value)"
          placeholder="Search city"></ui-input>
          <ui-button variant="plain" [class]="'text-white bg-gray-950 py-[5px] px-4 rounded-r-md'" label="Search"></ui-button>
        </div>
        <div class="flex">
          <div class="p-5">
          <ui-button variant="icon" [class]="'h-10 w-full'" [label]="'/assets/images/current-location.svg'"></ui-button>
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

  constructor() {
    const debouncedLog = debounce((value) => {
      console.log(value);
    }, 400);

    effect(() => {
      debouncedLog(this.searchCity());
    });
  }
  ngOnInit(): void {
  }


}
