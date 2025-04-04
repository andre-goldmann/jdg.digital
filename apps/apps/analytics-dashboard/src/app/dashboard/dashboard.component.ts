import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BalanceCardComponent } from './balance-card/balance-card.component';
import { AccountsCardComponent } from './accounts-card/accounts-card.component';
import { ExchangeCardComponent } from './exchange-card/exchange-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SidebarComponent,
    BalanceCardComponent,
    AccountsCardComponent,
    ExchangeCardComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {}