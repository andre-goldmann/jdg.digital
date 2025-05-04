import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-service-tenant-dialog',
  imports: [
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule,
    MatDialogClose,
  ],
  templateUrl: './service-tenant-dialog.component.html',
  styleUrl: './service-tenant-dialog.component.css',
})
export class ServiceTenantDialogComponent {
  service = '';
  tenant = '';
}
