import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { SettingToolbarComponent } from './setting-toolbar/setting-toolbar.component';
import { Configuration } from '../flags/model';



const CONFIG_DATA: Configuration[] = [
  { service: 'Auth', tenant: 'TenantA', fileName: 'auth.conf' },
  { service: 'Billing', fileName: 'billing.conf' }
];

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    SettingToolbarComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  displayedColumns: string[] = ['service', 'tenant', 'fileName', 'actions'];
  dataSource = new MatTableDataSource<Configuration>(CONFIG_DATA);

  dataUpload(configuration: Configuration) {
    this.dataSource.data = [...this.dataSource.data, configuration];
    console.info("Configuration added: ", configuration);
  }

  onDelete(row: Configuration) {
    // Implement delete logic
    console.log('Delete', row);
    this.dataSource.data = this.dataSource.data.filter(item => item !== row);
  }

  onUpdate(row: Configuration) {
    // Implement update logic
    console.log('Update', row);
  }
}
