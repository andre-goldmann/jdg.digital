import {signalStore, withState, withMethods, withComputed, patchState} from '@ngrx/signals';
import { computed } from '@angular/core';

// Define the shape of your invoice data
export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'unpaid' | 'overdue';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Define the shape of your form data
export interface InvoiceFormState {
  from: Date;
  to: Date;
  customerId: string | null;
  status: 'all' | 'paid' | 'unpaid' | 'overdue';
}

// Define the complete state
export interface InvoiceState extends InvoiceFormState {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  selectedInvoiceId: string | null;
}

const initialState: InvoiceState = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)),
  to: new Date(),
  customerId: null,
  status: 'all',
  invoices: [],
  loading: false,
  error: null,
  selectedInvoiceId: null
};

export const InvoicesStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),
  withComputed((store) => ({
    // Computed signals for filtered data
    filteredInvoices: computed(() => {
      const invoices = store.invoices();
      const status = store.status();
      const customerId = store.customerId();
      const from = store.from();
      const to = store.to();

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
    }),

    // Financial computed values
    totalAmount: computed(() => {
      const invoices = store.invoices();
      const status = store.status();
      const customerId = store.customerId();
      const from = store.from();
      const to = store.to();

      const filtered = invoices.filter(invoice => {
        if (status !== 'all' && invoice.status !== status) return false;
        if (customerId && invoice.customerId !== customerId) return false;
        const invoiceDate = new Date(invoice.dueDate);
        if (invoiceDate < from || invoiceDate > to) return false;
        return true;
      });

      return filtered.reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0);
    }),

    paidAmount: computed(() => {
      const invoices = store.invoices();
      const status = store.status();
      const customerId = store.customerId();
      const from = store.from();
      const to = store.to();

      const filtered = invoices.filter(invoice => {
        if (status !== 'all' && invoice.status !== status) return false;
        if (customerId && invoice.customerId !== customerId) return false;
        const invoiceDate = new Date(invoice.dueDate);
        if (invoiceDate < from || invoiceDate > to) return false;
        return true;
      });

      return filtered
        .filter((invoice: Invoice) => invoice.status === 'paid')
        .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0);
    }),

    unpaidAmount: computed(() => {
      const invoices = store.invoices();
      const status = store.status();
      const customerId = store.customerId();
      const from = store.from();
      const to = store.to();

      const filtered = invoices.filter(invoice => {
        if (status !== 'all' && invoice.status !== status) return false;
        if (customerId && invoice.customerId !== customerId) return false;
        const invoiceDate = new Date(invoice.dueDate);
        if (invoiceDate < from || invoiceDate > to) return false;
        return true;
      });

      return filtered
        .filter((invoice: Invoice) => invoice.status === 'unpaid')
        .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0);
    }),

    overdueAmount: computed(() => {
      const invoices = store.invoices();
      const status = store.status();
      const customerId = store.customerId();
      const from = store.from();
      const to = store.to();

      const filtered = invoices.filter(invoice => {
        if (status !== 'all' && invoice.status !== status) return false;
        if (customerId && invoice.customerId !== customerId) return false;
        const invoiceDate = new Date(invoice.dueDate);
        if (invoiceDate < from || invoiceDate > to) return false;
        return true;
      });

      return filtered
        .filter((invoice: Invoice) => invoice.status === 'overdue')
        .reduce((sum: number, invoice: Invoice) => sum + invoice.amount, 0);
    }),

    // Summary statistics
    invoiceStats: computed(() => {
      const invoices = store.invoices();
      const status = store.status();
      const customerId = store.customerId();
      const from = store.from();
      const to = store.to();

      const filtered = invoices.filter(invoice => {
        if (status !== 'all' && invoice.status !== status) return false;
        if (customerId && invoice.customerId !== customerId) return false;
        const invoiceDate = new Date(invoice.dueDate);
        if (invoiceDate < from || invoiceDate > to) return false;
        return true;
      });

      return {
        total: filtered.length,
        paid: filtered.filter((i: Invoice) => i.status === 'paid').length,
        unpaid: filtered.filter((i: Invoice) => i.status === 'unpaid').length,
        overdue: filtered.filter((i: Invoice) => i.status === 'overdue').length
      };
    }),

    // Selected invoice
    selectedInvoice: computed(() => {
      const selectedId = store.selectedInvoiceId();
      return selectedId ? store.invoices().find(invoice => invoice.id === selectedId) || null : null;
    })
  })),
  withMethods((store) => {
    return {
      // Filter methods
      setDateRange(from: Date, to: Date) {
        patchState(store, { from, to });
      },

      setCustomerFilter(customerId: string | null) {
        patchState(store, { customerId });
      },

      setStatusFilter(status: 'all' | 'paid' | 'unpaid' | 'overdue') {
        patchState(store, { status });
      },

      // Invoice management methods
      setLoading(loading: boolean) {
        patchState(store, { loading });
      },

      setError(error: string | null) {
        patchState(store, { error });
      },

      loadInvoices(invoices: Invoice[]) {
        patchState(store, { invoices, loading: false, error: null });
      },

      addInvoice(invoice: Invoice) {
        patchState(store, { 
          invoices: [...store.invoices(), invoice] 
        });
      },

      updateInvoice(invoiceId: string, updates: Partial<Invoice>) {
        const invoices = store.invoices().map(invoice => 
          invoice.id === invoiceId ? { ...invoice, ...updates } : invoice
        );
        patchState(store, { invoices });
      },

      deleteInvoice(invoiceId: string) {
        const invoices = store.invoices().filter(invoice => invoice.id !== invoiceId);
        patchState(store, { invoices });
      },

      // Selection methods
      selectInvoice(invoiceId: string | null) {
        patchState(store, { selectedInvoiceId: invoiceId });
      },

      // Reset methods
      resetFilters() {
        patchState(store, {
          from: new Date(new Date().setDate(new Date().getDate() - 30)),
          to: new Date(),
          customerId: null,
          status: 'all'
        });
      },

      clearError() {
        patchState(store, { error: null });
      }
    };
  })
);
