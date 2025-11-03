import { computed, Injectable, signal } from '@angular/core';
import type { Invoice, InvoiceState } from './invoices.store';

/**
 * Pure Angular Signals implementation of invoice store
 * Alternative to @ngrx/signals approach
 */
@Injectable({
  providedIn: 'root'
})
export class InvoicesPureSignalsStore {
  // Private signals for internal state
  private readonly _invoices = signal<Invoice[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _selectedInvoiceId = signal<string | null>(null);
  
  // Filter signals
  private readonly _from = signal<Date>(new Date(new Date().setDate(new Date().getDate() - 30)));
  private readonly _to = signal<Date>(new Date());
  private readonly _customerId = signal<string | null>(null);
  private readonly _status = signal<'all' | 'paid' | 'unpaid' | 'overdue'>('all');

  // Public readonly signals
  readonly invoices = this._invoices.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly selectedInvoiceId = this._selectedInvoiceId.asReadonly();
  readonly from = this._from.asReadonly();
  readonly to = this._to.asReadonly();
  readonly customerId = this._customerId.asReadonly();
  readonly status = this._status.asReadonly();

  // Computed signals for filtered data
  readonly filteredInvoices = computed(() => {
    const invoices = this._invoices();
    const status = this._status();
    const customerId = this._customerId();
    const from = this._from();
    const to = this._to();

    return invoices.filter(invoice => {
      // Filter by status
      if (status !== 'all' && invoice.status !== status) {
        return false;
      }

      // Filter by customer
      if (customerId && invoice.customerId !== customerId) {
        return false;
      }

      // Filter by date range
      const invoiceDate = new Date(invoice.dueDate);
      if (invoiceDate < from || invoiceDate > to) {
        return false;
      }

      return true;
    });
  });

  // Financial computed values
  readonly totalAmount = computed(() => {
    return this.filteredInvoices().reduce((sum, invoice) => sum + invoice.amount, 0);
  });

  readonly paidAmount = computed(() => {
    return this.filteredInvoices()
      .filter(invoice => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  });

  readonly unpaidAmount = computed(() => {
    return this.filteredInvoices()
      .filter(invoice => invoice.status === 'unpaid')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  });

  readonly overdueAmount = computed(() => {
    return this.filteredInvoices()
      .filter(invoice => invoice.status === 'overdue')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  });

  // Summary statistics
  readonly invoiceStats = computed(() => {
    const filtered = this.filteredInvoices();
    return {
      total: filtered.length,
      paid: filtered.filter(i => i.status === 'paid').length,
      unpaid: filtered.filter(i => i.status === 'unpaid').length,
      overdue: filtered.filter(i => i.status === 'overdue').length
    };
  });

  // Selected invoice
  readonly selectedInvoice = computed(() => {
    const selectedId = this._selectedInvoiceId();
    return selectedId ? this._invoices().find(invoice => invoice.id === selectedId) || null : null;
  });

  // Complete state as computed signal
  readonly state = computed((): InvoiceState => ({
    from: this._from(),
    to: this._to(),
    customerId: this._customerId(),
    status: this._status(),
    invoices: this._invoices(),
    loading: this._loading(),
    error: this._error(),
    selectedInvoiceId: this._selectedInvoiceId()
  }));

  // Filter methods
  setDateRange(from: Date, to: Date): void {
    this._from.set(from);
    this._to.set(to);
  }

  setCustomerFilter(customerId: string | null): void {
    this._customerId.set(customerId);
  }

  setStatusFilter(status: 'all' | 'paid' | 'unpaid' | 'overdue'): void {
    this._status.set(status);
  }

  // Invoice management methods
  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  loadInvoices(invoices: Invoice[]): void {
    this._invoices.set(invoices);
    this._loading.set(false);
    this._error.set(null);
  }

  addInvoice(invoice: Invoice): void {
    this._invoices.update(current => [...current, invoice]);
  }

  updateInvoice(invoiceId: string, updates: Partial<Invoice>): void {
    this._invoices.update(current => 
      current.map(invoice => 
        invoice.id === invoiceId ? { ...invoice, ...updates } : invoice
      )
    );
  }

  deleteInvoice(invoiceId: string): void {
    this._invoices.update(current => 
      current.filter(invoice => invoice.id !== invoiceId)
    );
  }

  // Selection methods
  selectInvoice(invoiceId: string | null): void {
    this._selectedInvoiceId.set(invoiceId);
  }

  // Reset methods
  resetFilters(): void {
    this._from.set(new Date(new Date().setDate(new Date().getDate() - 30)));
    this._to.set(new Date());
    this._customerId.set(null);
    this._status.set('all');
  }

  clearError(): void {
    this._error.set(null);
  }

  // Batch operations
  updateMultipleInvoices(invoiceIds: string[], updates: Partial<Invoice>): void {
    this._invoices.update(current => 
      current.map(invoice => 
        invoiceIds.includes(invoice.id) ? { ...invoice, ...updates } : invoice
      )
    );
  }

  deleteMultipleInvoices(invoiceIds: string[]): void {
    this._invoices.update(current => 
      current.filter(invoice => !invoiceIds.includes(invoice.id))
    );
  }

  // Utility methods
  findInvoiceById(invoiceId: string): Invoice | undefined {
    return this._invoices().find(invoice => invoice.id === invoiceId);
  }

  getInvoicesByCustomer(customerId: string): Invoice[] {
    return this._invoices().filter(invoice => invoice.customerId === customerId);
  }

  getOverdueInvoices(): Invoice[] {
    return this._invoices().filter(invoice => invoice.status === 'overdue');
  }
}