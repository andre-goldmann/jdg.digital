import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exchange-card',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './exchange-card.component.html',
  styleUrls: ['./exchange-card.component.scss']
})
export class ExchangeCardComponent {
  spendAmount = 3110.00;
  getAmount = 0.673321;
  spendCurrency = 'USD';
  getCurrency = 'BTC';
  exchangeRate = 6893.06;
}