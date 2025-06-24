import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

import {MatInputModule} from '@angular/material/input';
import { FlagDto } from '../model';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  selector: 'app-editform',
  templateUrl: './editform.component.html',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
],
  styleUrls: ['./editform.component.css'],
})
export class EditformComponent {
  //s = input<ConfigRow>();
  @Input() selectedRow: FlagDto | null = null;// The selected row data from the table
  @Output() formSubmit = new EventEmitter<any>(); // Emit the updated data on form submission

  saving = false;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    if (!this.selectedRow) {
      return;
    }

    this.saving = true;

    // Make a copy to avoid mutation issues
    const rowToSubmit = {...this.selectedRow};

    // Send the update to the server
    this.http.put(`/api/flags`, rowToSubmit)
      .subscribe({
        next: (updatedRow) => {
          this.snackBar.open('Configuration updated successfully', 'Close', {
            duration: 3000,
          });
          this.formSubmit.emit(updatedRow);
          this.saving = false;
        },
        error: (error) => {
          console.error('Error updating configuration:', error);
          this.snackBar.open('Error updating configuration', 'Close', {
            duration: 3000,
          });
          // TODO reload database
          this.saving = false;
        }
      });
  }
}
