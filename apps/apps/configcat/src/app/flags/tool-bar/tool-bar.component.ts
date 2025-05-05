import { Component, inject, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeatureFlagDialogComponent } from '../feature-flag-dialog/feature-flag-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
// needs to run on server to use papaparse directly
//import { Papa } from 'ngx-papaparse';
import { ConfigRow } from '../model';
import { FlagsService } from '../flags.service';

@Component({
  selector: 'app-tool-bar',
  imports:[MatDialogModule, CommonModule],
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent {
  searchChange = output<string>();
  parsedData = output<ConfigRow[]>();

  flagsService = inject(FlagsService);

  comboOptions = ['ADD FEATURE FLAG', 'ADD TEXT SETTING', 'ADD WHOLE NUMBER SETTING',
    'ADD DECIMAL NUMBER SETTING'];
  selectedOption = signal(this.comboOptions[0]);
  comboOpen = false;

  constructor(private dialog: MatDialog) {}

  selectOption(option: string): void {
    this.comboOpen = false;
    if (option === 'ADD FEATURE FLAG') {
      this.openDialog();
    }
    // Add logic for other options if needed
  }

  openDialog(): void {
    this.dialog.open(FeatureFlagDialogComponent, {
      width: '400px',
    });
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchChange.emit(filterValue.trim().toLowerCase());
  }

  showDialog(type: string) {
    this.openDialog();
  }

  onFileSelected(event: Event) {
    const fileInput = document.createElement('input');
    const service = 'service'; // Replace with actual service
    const tenant = 'tenant'; // Replace with actual tenant
    fileInput.type = 'file';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        this.flagsService.parseDescription(service, tenant, file, file.name);
      }
    };
    fileInput.click();


  }
}
