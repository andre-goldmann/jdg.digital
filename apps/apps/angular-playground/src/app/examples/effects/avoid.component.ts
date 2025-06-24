import { Component, computed, effect, inject, linkedSignal, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-avoid',
  imports: [FormsModule],
  template: `
    <h1>Star Wars Vehicle Sales</h1>
    <select class="select" (change)="onSelectedVehicle($event.target)">
      <option value="" disabled selected>--Select a vehicle--</option>
      @for(vehicle of vehicles(); track vehicle) {
      <option [value]="vehicle.id">{{ vehicle.name }}</option>
      }
    </select>
    <div>Quantity: <input type="number" [(ngModel)]="quantity" /></div>
    <div>Vehicle: {{ selectedVehicle()?.name }}</div>
    <div>Movie: {{ movie()?.title }}</div>
    <div>Price: {{ selectedVehicle()?.price }}</div>
    <div [style.color]="color()">Total: {{ total() }}</div>
  `,
  styleUrl: './avoid.component.css',
})
export class AvoidComponent {
  private url = 'https://swapi.py4e.com/api/films';

  // Signals to support the template
  selectedVehicle = signal<Vehicle | undefined>(undefined);
  // Task 2: Reset the quantity when the vehicle changes
  quantity = linkedSignal({
    source: this.selectedVehicle,
    computation: () => 1,
  });

  vehicles = signal<Vehicle[]>([
    { id: 1, name: 'Sand Crawler', price: 22050 },
    { id: 2, name: 'AT-AT', price: 10050 },
    { id: 3, name: 'TIE Fighter', price: 55000 },
  ]);

  // Task 1: React to changes and adjust the total and color.
  total = computed(
    () => (this.selectedVehicle()?.price ?? 0) * this.quantity()
  );
  color = computed(() => (this.total() > 50000 ? 'green' : 'blue'));

  // Task 3: Retrieve the movies for the selected vehicle
  // To simplify, this only returns a single movie
  http = inject(HttpClient);
  movieResource = rxResource({
    request: this.selectedVehicle,
    // Destructuring: extracting the `request` property and assigning its value to `vehicle`.
    loader: ({ request: vehicle }) =>
      this.http.get<Film>(`${this.url}/${vehicle?.id}`),
  });
  movie = computed(() => this.movieResource.value());

  // Task 4: Log out signals when they change
  qtyEff = effect(() => console.log('quantity:', this.quantity()));
  vehEff = effect(() =>
    console.log('vehicle:', JSON.stringify(this.selectedVehicle()))
  );

  onSelectedVehicle(ele: EventTarget | null) {
    // Get the id from the element
    const id = Number((ele as HTMLSelectElement).value);
    // Find the vehicle in the array
    const foundVehicle = this.vehicles().find((v) => v.id === id);

    // Set it as the selected vehicle
    if (foundVehicle) {
      this.selectedVehicle.set(foundVehicle);
    }
  }
}

export interface Vehicle {
  id: number;
  name: string;
  price: number;
}

export interface Film {
  title: string;
}


