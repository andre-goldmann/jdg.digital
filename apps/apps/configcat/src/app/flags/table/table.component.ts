import { Component, input, effect, output } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ConfigRow } from '../model';

@Component({
  selector: 'app-table',
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements AfterViewInit {

  filterValue = input<string>('');
  uploadedData = input<ConfigRow[]>();

  displayedColumns: string[] = [
    'Service',
    'Property',
    'Description',
    //'Type/Range',
    'Default',
    //'Relevant constraints or dependencies',
    'Category',
    'Remarks'];
  dataSource: MatTableDataSource<ConfigRow>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Create 100 users
    //const users = Array.from({ length: 2 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.uploadedData());

    effect(() => {
      console.log("Filter changed to: ", this.filterValue());
      this.dataSource.filter = this.filterValue().trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
      /*this.dataSource = this.dataSource.filter(element =>
        element.name.toLowerCase().includes(this.filterValue().toLowerCase()) ||
        element.symbol.toLowerCase().includes(this.filterValue().toLowerCase())
      );*/
    });

    effect(() => {
      console.log("Data uploaded: ", this.uploadedData());
      if(this.uploadedData() != null && this.uploadedData()!.length > 0) {
        this.dataSource.data = this.uploadedData() as ConfigRow[];
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}

