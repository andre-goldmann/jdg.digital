import { Component, input, effect, resource, signal, Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FlagDto } from '../model';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-table',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements AfterViewInit {
  @Output() rowSelected = new EventEmitter<FlagDto>();
  selectedRow: any = null;

  filterValue = input<string>('');
  envFilter = input<string>('');
  serviceFilter = input<string>('');
  tenantFilter = input<string>('');
  uploadedData = input<FlagDto[]>();

  displayedColumns: string[] = [
    'Environment',
    'Service',
    'Tenant',
    'Property',
    'Default',
    'Description',
    'Type/Range',
    'Constraints or dependencies',
    'Category',
    'Remarks',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  page = signal(1);
  pageSize = signal(8);
  totalItems = signal(0);

  configurations = resource<FlagDto[], {
    page: number,
    pageSize:number,
    textFilter:string,
    envFilter:string,
    serviceFilter:string,
    tenantFilter:string}>({
    params: () => ({
      page: this.page(),
      pageSize: this.pageSize(),
      textFilter: this.filterValue(),
      envFilter: this.envFilter(),
      serviceFilter: this.serviceFilter(),
      tenantFilter: this.tenantFilter()}),
    loader: async ({params}) => {

      let url = `api/flags?page=${params.page}&pageSize=${params.pageSize}`;
      //console.info(request);
      if(params.textFilter && params.textFilter.length > 0) {
        url += `&textFilter=${params.textFilter}`;
      }
      if(params.envFilter && params.envFilter.length > 0) {
        url += `&envFilter=${params.envFilter}`;
      }
      if(params.serviceFilter && params.serviceFilter.length > 0) {
        url += `&serviceFilter=${params.serviceFilter}`;
      }
      if(params.tenantFilter && params.tenantFilter.length > 0) {
        url += `&tenantFilter=${params.tenantFilter}`;
      }

      const confs = await fetch(url);
      if (!confs.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await confs.json();
      this.totalItems.set(data['total']);
      this.paginator.length = data['total'];
      //console.info(data['items']);
      this.dataSource.data = data['items'] as FlagDto[];
      return data;
    },
  });

  dataSource: MatTableDataSource<FlagDto> = new MatTableDataSource<FlagDto>([]);

  constructor() {
    effect(() => {
      if (this.uploadedData() != null && this.uploadedData()!.length > 0) {
        console.log('Data uploaded going to first page.. ');
        // to reload the page
        this.page.set(2);
        this.page.set(1);
      }
    });
  }

  ngAfterViewInit(): void {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    this.paginator.page.subscribe(() => this.loadData());
  }

  private loadData() {
    this.page.set(this.paginator.pageIndex+1);
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  onRowClick(row: FlagDto) {
    if(row.description == null) {
      row.description = {
        description: '',
        typerange: '',
        constraints: '',
        category: '',
        remarks: ''
      };
    }
    this.rowSelected.emit(row);
  }

}
