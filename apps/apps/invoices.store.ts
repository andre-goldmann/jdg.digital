import {signalStore, withState, withMethods, withComputed} from '@ngrx/signals';


export const InvoicesStore = signalStore(
  {providedIn: 'root'},
  withState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
    //customerId: null as string | null,
    //status: 'all' as 'all' | 'paid' | 'unpaid' | 'overdue',
  }),
  withComputed((store) => ({

  })),
  /*withMethods((store) => ({

  }))*/
);
