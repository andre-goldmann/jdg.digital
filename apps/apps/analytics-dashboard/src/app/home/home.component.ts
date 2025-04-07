import { Component } from '@angular/core';
import { BalanceCardComponent } from '../dashboard/balance-card/balance-card.component';
import { ExchangeCardComponent } from '../dashboard/exchange-card/exchange-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [BalanceCardComponent, ExchangeCardComponent],
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor() {}
}
