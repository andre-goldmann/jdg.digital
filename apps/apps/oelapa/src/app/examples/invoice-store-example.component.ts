import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InvoicesStore } from '../invoices.store';
import { InvoicesPureSignalsStore } from '../invoices-pure-signals.store';
import { CommonModule } from '@angular/common';

/**
 * Example component demonstrating both invoice store implementations
 * Shows how to use @ngrx/signals vs pure Angular signals
 */
@Component({
  selector: 'app-invoice-store-example',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="invoice-stores-demo">
      <h2>Invoice Stores Comparison</h2>
      
      <!-- @ngrx/signals Store -->
      <div class="store-section">
        <h3>@ngrx/signals Store</h3>
        <div class="stats">
          <p>Total Invoices: {{ ngrxStore.filteredInvoices().length }}</p>
          <p>Total Amount: {{ ngrxStore.totalAmount() | currency }}</p>
          <p>Paid Amount: {{ ngrxStore.paidAmount() | currency }}</p>
          <p>Unpaid Amount: {{ ngrxStore.unpaidAmount() | currency }}</p>
          <p>Status Filter: {{ ngrxStore.status() }}</p>
          <p>Loading: {{ ngrxStore.loading() }}</p>
        </div>
        
        <div class="actions">
          <button (click)="loadSampleDataNgrx()">Load Sample Data</button>
          <button (click)="setStatusFilterNgrx('paid')">Show Paid</button>
          <button (click)="setStatusFilterNgrx('unpaid')">Show Unpaid</button>
          <button (click)="ngrxStore.resetFilters()">Reset Filters</button>
        </div>
      </div>

      <!-- Pure Angular Signals Store -->
      <div class="store-section">
        <h3>Pure Angular Signals Store</h3>
        <div class="stats">
          <p>Total Invoices: {{ pureStore.filteredInvoices().length }}</p>
          <p>Total Amount: {{ pureStore.totalAmount() | currency }}</p>
          <p>Paid Amount: {{ pureStore.paidAmount() | currency }}</p>
          <p>Unpaid Amount: {{ pureStore.unpaidAmount() | currency }}</p>
          <p>Status Filter: {{ pureStore.status() }}</p>
          <p>Loading: {{ pureStore.loading() }}</p>
        </div>
        
        <div class="actions">
          <button (click)="loadSampleDataPure()">Load Sample Data</button>
          <button (click)="pureStore.setStatusFilter('paid')">Show Paid</button>
          <button (click)="pureStore.setStatusFilter('unpaid')">Show Unpaid</button>
          <button (click)="pureStore.resetFilters()">Reset Filters</button>
        </div>
      </div>

      <!-- Invoice Lists -->
      <div class="invoice-lists">
        <div class="list-section">
          <h4>@ngrx/signals Invoices</h4>
          @for (invoice of ngrxStore.filteredInvoices(); track invoice.id) {
            <div class="invoice-item" [class.selected]="ngrxStore.selectedInvoiceId() === invoice.id">
              <span>{{ invoice.customerName }}</span>
              <span>{{ invoice.amount | currency }}</span>
              <span [class]="'status-' + invoice.status">{{ invoice.status }}</span>
              <button (click)="ngrxStore.selectInvoice(invoice.id)">Select</button>
            </div>
          } @empty {
            <p>No invoices found</p>
          }
        </div>

        <div class="list-section">
          <h4>Pure Signals Invoices</h4>
          @for (invoice of pureStore.filteredInvoices(); track invoice.id) {
            <div class="invoice-item" [class.selected]="pureStore.selectedInvoiceId() === invoice.id">
              <span>{{ invoice.customerName }}</span>
              <span>{{ invoice.amount | currency }}</span>
              <span [class]="'status-' + invoice.status">{{ invoice.status }}</span>
              <button (click)="pureStore.selectInvoice(invoice.id)">Select</button>
            </div>
          } @empty {
            <p>No invoices found</p>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .invoice-stores-demo {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .store-section {
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
      background: #f9f9f9;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
      margin-bottom: 16px;
    }

    .stats p {
      margin: 4px 0;
      padding: 8px;
      background: white;
      border-radius: 4px;
    }

    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .actions button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      background: #007bff;
      color: white;
      cursor: pointer;
    }

    .actions button:hover {
      background: #0056b3;
    }

    .invoice-lists {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 30px;
    }

    .list-section {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
    }

    .list-section h4 {
      margin-top: 0;
      color: #333;
    }

    .invoice-item {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 10px;
      align-items: center;
      padding: 8px;
      border-bottom: 1px solid #eee;
    }

    .invoice-item.selected {
      background: #e3f2fd;
      border-color: #2196f3;
    }

    .invoice-item button {
      padding: 4px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
      cursor: pointer;
    }

    .status-paid { color: green; font-weight: bold; }
    .status-unpaid { color: orange; font-weight: bold; }
    .status-overdue { color: red; font-weight: bold; }

    @media (max-width: 768px) {
      .invoice-lists {
        grid-template-columns: 1fr;
      }
      
      .stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class InvoiceStoreExampleComponent {
  // Inject both store implementations
  readonly ngrxStore = inject(InvoicesStore);
  readonly pureStore = inject(InvoicesPureSignalsStore);

  // Sample data for demonstration
  private readonly sampleInvoices = [
    {
      id: '1',
      customerId: 'cust1',
      customerName: 'Acme Corp',
      amount: 1500.00,
      dueDate: new Date('2024-12-15'),
      status: 'paid' as const,
      items: [
        { id: 'item1', description: 'Consulting', quantity: 10, unitPrice: 150, total: 1500 }
      ]
    },
    {
      id: '2',
      customerId: 'cust2',
      customerName: 'Tech Solutions',
      amount: 2400.00,
      dueDate: new Date('2024-12-20'),
      status: 'unpaid' as const,
      items: [
        { id: 'item2', description: 'Development', quantity: 20, unitPrice: 120, total: 2400 }
      ]
    },
    {
      id: '3',
      customerId: 'cust3',
      customerName: 'Global Industries',
      amount: 800.00,
      dueDate: new Date('2024-11-30'),
      status: 'overdue' as const,
      items: [
        { id: 'item3', description: 'Support', quantity: 8, unitPrice: 100, total: 800 }
      ]
    }
  ];

  loadSampleDataNgrx(): void {
    this.ngrxStore.setLoading(true);
    // Simulate async loading
    setTimeout(() => {
      this.ngrxStore.loadInvoices(this.sampleInvoices);
    }, 500);
  }

  loadSampleDataPure(): void {
    this.pureStore.setLoading(true);
    // Simulate async loading
    setTimeout(() => {
      this.pureStore.loadInvoices(this.sampleInvoices);
    }, 500);
  }

  setStatusFilterNgrx(status: 'all' | 'paid' | 'unpaid' | 'overdue'): void {
    this.ngrxStore.setStatusFilter(status);
  }
}