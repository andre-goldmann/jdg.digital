import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IconService } from './core/services/icon.service';

@Component({
  imports: [RouterModule, DashboardComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'analytics-dashboard';

  constructor(private iconService:IconService) {
    iconService.registerIcons();
  }
}
