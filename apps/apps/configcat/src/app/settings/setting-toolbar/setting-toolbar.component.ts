import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { ServiceTenantDialogComponent } from './service-tenant-dialog/service-tenant-dialog.component';
import { ConfigFile } from '../../flags/model';
import { SettingsService } from '../settings.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-setting-toolbar',
  imports:[MatDialogModule, CommonModule, MatInputModule],
  templateUrl: './setting-toolbar.component.html',
  styleUrl: './setting-toolbar.component.css',
})
export class SettingToolbarComponent {

  dataUpload = output<ConfigFile>();
  settingService = inject(SettingsService);

  constructor(private dialog: MatDialog) {

  }

  openServiceTenantDialog() {
    const dialogRef = this.dialog.open(ServiceTenantDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contains {service, tenant}
        this.openFileDialog(result.env, result.service, result.tenant);
      }
    });
  }

  openFileDialog(env:string, service: string, tenant: string) {
    // Create a hidden file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept='.yml, .yaml, .properties';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;
          this.processSelection(env, service, tenant, fileContent, file.name);
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();

  }

  processSelection(env:string, service: string, tenant: string, fileContent: any, fileName: string) {
    // Handle the selected values and file content here
    console.log('Env:', env);
    console.log('Service:', service);
    console.log('Tenant:', tenant);
    console.log('File Content:', fileContent);
    this.convertConfigToRows(env, service, tenant, fileContent, fileName).subscribe(rows => {
      console.log('Converted Rows:', rows);
      // You can do something with the converted rows here
    });
    // Your processing logic here
    const conf:ConfigFile =  {
      id:0,
      env: env,
      service: service,
      tenant: tenant,
      filename: fileName,
      path:"",
      stamp: new Date().toISOString(),
    }
    this.dataUpload.emit(conf);
  }

  /**
   * Converts Spring config file content (YAML or .properties) to ConfigRow[]
   * @param fileContent The content of the config file as string
   * @param fileName The name of the file (used to detect type)
   */
  convertConfigToRows(env:string, service: string, tenant: string, fileContent: string, fileName: string): Observable<ConfigFile[]> {
    return this.settingService.convertAndStoreData(env, service, tenant, fileContent, fileName);
  }
}
