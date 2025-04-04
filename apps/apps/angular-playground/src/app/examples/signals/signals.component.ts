import { Component, computed, input, model, signal } from '@angular/core';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-signals',
  imports: [
    MatCardContent,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatSliderModule],
  templateUrl: './signals.component.html',
  styleUrl: './signals.component.scss',
})
export class SignalsComponent {
  // Calculator example
  thumbLabel = false;
  max = input(100);
  min = input(0);
  step = input(1);
  //num1 = signal(0);
  //num2 = input<number>();
  //value = input.required<number>();

  value = signal(0);
  value2 = signal(0);//model(0);
  result = computed(() => this.value() + this.value2());
  add() {
    // this.result.set(this.num1() + this.num2());
  }
}
