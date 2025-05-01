import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeatureFlagDialogComponent } from './flags/feature-flag-dialog/feature-flag-dialog.component';

@NgModule({
  declarations: [FeatureFlagDialogComponent],
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  exports: [FeatureFlagDialogComponent],
})
export class AppModule {}
