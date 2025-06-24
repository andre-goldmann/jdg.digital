import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SidebarComponent,
    RouterOutlet
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private api: ApiService) {}

  fetchData() {
    /*this.api.getExample().subscribe(response:string => {
      console.log('Server response:', response);
    });*/
    this.api.getExample().subscribe({
      next: (response: string) => {
        console.log('Server response:', response);
      },
      error: (error:any) => {
        console.error('Error fetching data:', error);
      },
    });
  }

  sendData() {
    const payload = { name: 'Angular User', value: 42 };
    this.api.postData(payload).subscribe();
  }
}
