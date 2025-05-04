import { Component } from '@angular/core';
import { ToolBarComponent } from '../tool-bar/tool-bar.component';
import { TableComponent } from '../table/table.component';
import { ConfigRow } from '../model';
import {MatListModule} from '@angular/material/list';

@Component({
  selector: 'app-overview',
  imports: [ToolBarComponent, TableComponent, MatListModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss',
})
export class OverviewComponent {
  searchText = '';
  uploadedData:ConfigRow[] = [];

  onSearchChange(value: string) {
    this.searchText = value;
  }

  uploadData(data: ConfigRow[]) {
    this.uploadedData = data;
  }
}

