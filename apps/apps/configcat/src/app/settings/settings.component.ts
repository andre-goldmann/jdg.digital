import { Component, resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { SettingToolbarComponent } from './setting-toolbar/setting-toolbar.component';
import { ConfigFile, Flag } from '../flags/model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    SettingToolbarComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  displayedColumns: string[] = ['environment', 'service', 'tenant', 'filename', 'actions'];
  dataSource = new MatTableDataSource<ConfigFile>([]);

  constructor(
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  configurations = resource<Flag[], unknown>({
    loader: async () => {
      const confs = await fetch(`api/configurationfiles`);
      if (!confs.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await confs.json();

      //this.totalItems.set(data['total']);
      //this.paginator.length = data['total'];
      console.info(data);
      this.dataSource.data = data as ConfigFile[];
      return data;
    },
  });

  dataUpload(configuration: ConfigFile) {
    this.dataSource.data = [...this.dataSource.data, configuration];
    console.info("Configuration added: ", configuration);
  }

  async onDelete(row: ConfigFile) {
    try {
      const response = await fetch(`/api/configurations/delete/${row.env}/${row.service}/${row.tenant}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }

      // Only remove from dataSource if delete was successful
      this.dataSource.data = this.dataSource.data.filter(item => item !== row);
      this.snackBar.open('Configuration deleted successfully', 'Close', { duration: 3000 });
    } catch (error) {
      console.error('Error deleting configuration:', error);
      // Here you could add user feedback about the error
    }
  }

  onUpdate(row: ConfigFile) {
    // Implement update logic
    console.log('Update', row);
  }

  onEdit(row: ConfigFile) {
    // Navigate to the editor route with env, service, tenant as params
    this.router.navigate(['/editor', row.env, row.service, row.tenant]);
  }

  onDownload(row: ConfigFile) {
    //console.log('Downloading file', row);

    // Create a URL to the download endpoint with the required parameters
    const downloadUrl = `/api/configurations/download/${row.env}/${row.service}/${row.tenant}`;

    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = row.filename; // Set the download attribute to suggest filename

    // Append to the document, trigger click and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}
