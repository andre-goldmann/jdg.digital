import { Component } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-balance-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
],
  templateUrl: './balance-card.component.html',
  styleUrls: ['./balance-card.component.scss']
})
export class BalanceCardComponent {
  balance = 10554.88;
  change = 231.5;
}