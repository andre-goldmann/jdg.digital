import { Component, linkedSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-linked-signal',
  imports: [CommonModule],
  templateUrl: './linked-signal.component.html',
  styleUrl: './linked-signal.component.css',
})
export class LinkedSignalComponent {
  courses = [
    {
      code: "BEGINNERS",
      title: "Angular for Beginners",
      defaultQuantity: 10
    },
    {
      code: "SIGNALS",
      title: "Angular Signals In Depth",
      defaultQuantity: 20
    },
    {
      code: "SSR",
      title: "Angular SSR In Depth",
      defaultQuantity: 30
    }
  ];

  selectedCourse = signal<string | null>('BEGINNERS');

  quantity = linkedSignal({
    source: () => ({courseCode: this.selectedCourse}),
    computation: (source, previous) => {
      //console.log(previous);
      //console.log(source);
      return this.courses.find(course => course.code === source.courseCode())?.defaultQuantity ?? 1
    }
  });
//
  constructor() {
  }

  onQuantityChanged(quantity: string) {
    //console.log(quantity);
    //this.quantity.set(parseInt(quantity));
  }

  onCourseSelected(courseCode: string) {
    this.selectedCourse.set(courseCode);
  }

}
