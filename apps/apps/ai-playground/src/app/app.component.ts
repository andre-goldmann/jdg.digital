import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatButton} from "@angular/material/button";

@Component({
  imports: [RouterModule, MatButton],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ai-playground';
}
