import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConfigData } from '../../../flags/model';
import { ConfigService } from '../../../config.service';


@Component({
  selector: 'app-service-tenant-dialog',
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
  templateUrl: './service-tenant-dialog.component.html',
  styleUrl: './service-tenant-dialog.component.css',
})
export class ServiceTenantDialogComponent implements OnInit {
  env = '';
  service = '';
  tenant = '';

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
}

