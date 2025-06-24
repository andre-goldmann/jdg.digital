import { Component, inject, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeatureFlagDialogComponent } from '../feature-flag-dialog/feature-flag-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

import { ConfigData, FlagDto } from '../model';
import { FlagsService } from '../flags.service';
import { ConfigService } from '../../config.service';

@Component({
  selector: 'app-tool-bar',
  imports: [MatDialogModule],
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent {
  searchChange = output<string>();
  envChange = output<string>();
  serviceChange = output<string>();
  tenantChange = output<string>();
  parsedData = output<FlagDto[]>();

  flagsService = inject(FlagsService);

  comboOptions = [
    'ADD FEATURE FLAG',
    'ADD TEXT SETTING',
    'ADD WHOLE NUMBER SETTING',
    'ADD DECIMAL NUMBER SETTING'];
  selectedOption = signal(this.comboOptions[0]);
  comboOpen = false;

  configData: ConfigData = {
    envs: [],
    services: [],
    tenants: []
  };

  constructor(private dialog: MatDialog) {}

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


  applyTextFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchChange.emit(filterValue.trim().toLowerCase());
  }

  applyEnvFilter(event: Event) {
    const filterValue = (event.target as HTMLSelectElement).value;
    console.info("[ToolBar]:Env filter value: ", event);
    this.envChange.emit(filterValue.trim().toLowerCase());
  }

  applyServiceFilter(event: Event) {
    const filterValue = (event.target as HTMLSelectElement).value;
    console.info("[ToolBar]:Service filter value: ", event);
    this.serviceChange.emit(filterValue.trim().toLowerCase());
  }

  applyTenantFilter(event: Event) {
    const filterValue = (event.target as HTMLSelectElement).value;
    console.info("[ToolBar]:Tenant filter value: ", filterValue);
    this.tenantChange.emit(filterValue.trim().toLowerCase());
  }

  openServiceTenantDialog() {
    const dialogRef = this.dialog.open(FeatureFlagDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // result contains {service, tenant}
        this.openFileDialog(result.env, result.service, result.tenant);
      }
    });
  }

  openFileDialog(env: string, service: string, tenant: string) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept='.csv, .txt';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      console.info("Uploading file: ", file);
      if (file) {

        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result;
          this.flagsService.parseDescription(env, service, tenant, fileContent, file.name)
            .subscribe(parsedData => {
                this.parsedData.emit(parsedData);
          });
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }


}
