import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IconService } from './core/services/icon.service';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [RouterModule, DashboardComponent, FormsModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'configcat';
  constructor(iconService: IconService) {
    iconService.registerIcons();
  }
}
