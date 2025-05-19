import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { EditformComponent } from '../editform/editform.component';
import { YamlEditorComponent } from '../../yaml/yamleditor.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ToolBarComponent } from '../tool-bar/tool-bar.component';
import { FlagDto } from '../model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    ToolBarComponent,
    TableComponent,
    EditformComponent,
    YamlEditorComponent,
    MatTabsModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  selectedTabIndex = signal(0);
  searchText = '';
  env = '';
  service = '';
  tenant = '';
  uploadedData: any[] = [];
  selectedRow!: FlagDto;


  onSearchChange(searchText: string) {
    this.searchText = searchText;
  }

  onEnvChange(env: string) {
    this.env = env;
  }

  onServiceChange(service: string) {
    this.service = service;
  }

  onTenantChange(tenant: string) {
    this.tenant = tenant;
  }

  uploadData(data: any[]) {
    this.uploadedData = data;
  }

  onRowSelected(row: any) {
    this.selectedRow = row;
  }

  onFormSubmit(updatedRow: any) {
    // Handle form submission
    console.log('Form submitted with:', updatedRow);
    // You might want to refresh the table data here
  }
}
