import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from './shared/data/services/theme.service';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected title = 'wellsync';
  private themeService = inject(ThemeService);

  // Inject the theme service to initialize it
  constructor() {
    // The theme service initialization happens in its constructor
    // We just need to make sure it's injected
  }
}
