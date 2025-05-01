import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ToolBarComponent } from '../tool-bar/tool-bar.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-feature-flag-dialog',
  imports: [MatSlideToggleModule,MatFormFieldModule, MatInputModule, FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './feature-flag-dialog.component.html',
  styleUrls: ['./feature-flag-dialog.component.css'],
})
export class FeatureFlagDialogComponent {
  feature = '';
  key = '';
  description = '';
  testEnv = false;
  prodEnv = false;

  constructor(public dialogRef: MatDialogRef<ToolBarComponent>) {}

  onAdd() {
    // Handle add logic here (e.g., send data back)
    this.dialogRef.close({
      feature: this.feature,
      key: this.key,
      description: this.description,
      testEnv: this.testEnv,
      prodEnv: this.prodEnv
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
