import { Component } from '@angular/core';


interface CryptoAccount {
  name: string;
  symbol: string;
  amount: number;
  logoColor: string;
}

@Component({
  selector: 'app-accounts-card',
  standalone: true,
  imports: [],
  templateUrl: './accounts-card.component.html',
  styleUrls: ['./accounts-card.component.scss']
})
export class AccountsCardComponent {
  accounts: CryptoAccount[] = [
    { name: 'Bitcoin', symbol: 'BTC', amount: 2.55462, logoColor: '#F7931A' },
    { name: 'Ethereum', symbol: 'ETH', amount: 12.456, logoColor: '#627EEA' },
    { name: 'Litecoin', symbol: 'LTC', amount: 25.789, logoColor: '#345D9D' },
    { name: 'Ripple', symbol: 'XRP', amount: 1250.5, logoColor: '#00AAE4' },
    { name: 'Monero', symbol: 'XMR', amount: 1.8533, logoColor: '#FF6600' }
  ];
}