import {signalStore, withState, withMethods, withComputed} from '@ngrx/signals';

// Define the shape of your form data
export interface InvoiceFormState {
  from: Date;
  to: Date;
}

const initialState: InvoiceFormState = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)),
  to: new Date()
};

export const InvoicesStore = signalStore(
  {providedIn: 'root'},
  withState( initialState
    //from: new Date(new Date().setDate(new Date().getDate() - 30)),
    //to: new Date(),
    //customerId: null as string | null,
    //status: 'all' as 'all' | 'paid' | 'unpaid' | 'overdue',
  ),
  withComputed((store) => ({

  })),
  withMethods((store) => ({

  }))
);
