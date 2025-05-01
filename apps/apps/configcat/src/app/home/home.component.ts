import { Component } from '@angular/core';
import { OverviewComponent } from '../flags/overview/overview.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',

  styleUrls: ['./home.component.scss'],
  imports: [OverviewComponent],
})
export class HomeComponent {
  constructor() {}
}
