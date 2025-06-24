import { Component, linkedSignal, signal } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-linked-signal',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInput
],
  templateUrl: './linked-signal.component.html',
  styleUrl: './linked-signal.component.scss',
})
export class LinkedSignalComponent {
  courses = new FormControl('');
  coursesList = [
    {
      code: 'BEGINNERS',
      title: 'Angular for Beginners',
      defaultQuantity: 10,
    },
    {
      code: 'SIGNALS',
      title: 'Angular Signals In Depth',
      defaultQuantity: 20,
    },
    {
      code: 'SSR',
      title: 'Angular SSR In Depth',
      defaultQuantity: 30,
    },
  ];

  selectedCourse = signal<string | null>('BEGINNERS');

  quantity = linkedSignal({
    source: () => ({ courseCode: this.selectedCourse }),
    computation: (source, previous) => {
      //console.log(previous);
      //console.log(source);
      return (
        this.coursesList.find((course) => course.code === source.courseCode())
          ?.defaultQuantity ?? 1
      );
    },
  });
  //
  constructor() {}

  onQuantityChanged(quantity: string) {
    //console.log(quantity);
    //this.quantity.set(parseInt(quantity));
  }

  onCourseSelected(courseCode: string) {
    console.info(courseCode);
    this.selectedCourse.set(courseCode);
  }
}
