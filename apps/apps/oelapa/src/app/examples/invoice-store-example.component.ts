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
  templateUrl: './invoice-store-example.component.html',
  styleUrl: './invoice-store-example.component.scss'
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
