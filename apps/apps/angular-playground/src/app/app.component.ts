import { Component, effect, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import {
  MatCardModule
} from '@angular/material/card';
import {
  MatExpansionModule
} from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  imports: [
    RouterModule,
    MatButton,
    LinkedSignalComponent,
    MatToolbar,
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-playground';

  darkMode = signal(false);

  constructor(private dialog: MatDialog) {}

  showDialog() {
    this.dialog.open(LinkedSignalComponent, {
      width: '500px',
    });
  }
  //
  applyDarkMode = effect(() => {
    const darkMode = this.darkMode();
    document.body.classList.toggle('darkMode', darkMode);
  });
}
