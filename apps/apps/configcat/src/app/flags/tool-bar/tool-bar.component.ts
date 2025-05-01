import { Component, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeatureFlagDialogComponent } from '../feature-flag-dialog/feature-flag-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Papa } from 'ngx-papaparse';
import { ConfigRow } from '../model';

@Component({
  selector: 'app-tool-bar',
  imports:[MatDialogModule, CommonModule],
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
})
export class ToolBarComponent {
  searchChange = output<string>();
  parsedData = output<ConfigRow[]>();

  comboOptions = ['ADD FEATURE FLAG', 'ADD TEXT SETTING', 'ADD WHOLE NUMBER SETTING',
    'ADD DECIMAL NUMBER SETTING'];
  selectedOption = signal(this.comboOptions[0]);
  comboOpen = false;

  constructor(private dialog: MatDialog,
              private papa: Papa) {}

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
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result:any) => {
        this.parsedData.emit(result.data);
        console.log('Parsed CSV:', this.parsedData);
      },
      error: (err:any) => {
        alert('Error parsing CSV: ' + err.message);
      }
    });
  }
}
