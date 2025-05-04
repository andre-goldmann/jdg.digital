import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { ServiceTenantDialogComponent } from './service-tenant-dialog/service-tenant-dialog.component';
import { ConfigRowSimple, Configuration } from '../../flags/model';

// needs to run on server
//import yaml from 'js-yaml';

@Component({
  selector: 'app-setting-toolbar',
  imports:[MatDialogModule, CommonModule, MatInputModule],
  templateUrl: './setting-toolbar.component.html',
  styleUrl: './setting-toolbar.component.css',
})
export class SettingToolbarComponent {

  dataUpload = output<Configuration>();

  constructor(private dialog: MatDialog) {

  }

  openServiceTenantDialog() {
    const dialogRef = this.dialog.open(ServiceTenantDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contains {service, tenant}
        this.openFileDialog(result.service, result.tenant);
      }
    });
  }

  openFileDialog(service: string, tenant: string) {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;
          this.processSelection(service, tenant, fileContent, file.name)
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }

  processSelection(service: string, tenant: string, fileContent: any, fileName: string) {
    // Handle the selected values and file content here
    console.log('Service:', service);
    console.log('Tenant:', tenant);
    console.log('File Content:', fileContent);
    const rows = this.convertConfigToRows(fileContent, fileName);
    // Your processing logic here
    const conf:Configuration =  {
      service: service,
      tenant: tenant,
      fileName: fileName
    }
    this.dataUpload.emit(conf);
  }

  /**
   * Converts Spring config file content (YAML or .properties) to ConfigRow[]
   * @param fileContent The content of the config file as string
   * @param fileName The name of the file (used to detect type)
   */
  convertConfigToRows(fileContent: string, fileName: string): ConfigRowSimple[] {
    if (fileName.endsWith('.yml') || fileName.endsWith('.yaml')) {
      // Parse YAML and flatten
      const yamlObj = yaml.load(fileContent) as any;
      return this.flattenYamlToRows(yamlObj);
    } else if (fileName.endsWith('.properties')) {
      return this.parsePropertiesToRows(fileContent);
    } else {
      throw new Error('Unsupported file type');
    }
  }

// Helper to flatten nested YAML object to ConfigRow[]
  flattenYamlToRows(obj: any, prefix = ''): ConfigRowSimple[] {
    let rows: ConfigRowSimple[] = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        rows = rows.concat(this.flattenYamlToRows(obj[key], prefix ? `${prefix}.${key}` : key));
      } else {
        rows.push({ key: prefix ? `${prefix}.${key}` : key, value: String(obj[key]) });
      }
    }
    return rows;
  }

// Helper to parse .properties file to ConfigRow[]
  parsePropertiesToRows(content: string): ConfigRowSimple[] {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const idx = line.indexOf('=');
        if (idx === -1) return null;
        const key = line.substring(0, idx).trim();
        const value = line.substring(idx + 1).trim();
        return { key, value };
      })
      .filter((row): row is ConfigRowSimple => !!row);
  }
}
