import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule, NgForOf } from '@angular/common';
import { ConfigData } from '../model';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config.service';

@Component({
  selector: 'app-feature-flag-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule,
    MatDialogClose,
  ],
  templateUrl: './feature-flag-dialog.component.html',
  styleUrls: ['./feature-flag-dialog.component.css'],
})
export class FeatureFlagDialogComponent implements OnInit {
  env = '';
  service = '';
  tenant = '';
  key = '';
  description = '';

  configData: ConfigData = {
    envs: [],
    services: [],
    tenants: []
  };

  configService = inject(ConfigService);

  ngOnInit() {
    this.configService.getConfigData().subscribe(
      (data) => {
        this.configData = data;
      },
      (error) => {
        console.error('Error fetching config data:', error);
      }
    );

  }

  //constructor(public dialogRef: MatDialogRef<ToolBarComponent>) {}

  onAdd() {
    // Handle add logic here (e.g., send data back)
    /*this.dialogRef.close({
      feature: this.feature,
      key: this.key,
      description: this.description,
      testEnv: this.testEnv,
      prodEnv: this.prodEnv
    });*/
  }

  onCancel() {
    ///this.dialogRef.close();
  }
}
