import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <header>
        <h1>{{ title }}</h1>
      </header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    
    header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px 0;
      border-bottom: 1px solid #eee;
    }
    
    h1 {
      margin: 0;
      color: #333;
      font-size: 2em;
    }
    
    main {
      min-height: calc(100vh - 200px);
    }
  `]
})
export class AppComponent {
  title = 'AI Chat';
}
