import { Route } from '@angular/router';

import { ExamplesComponent } from './examples/examples.component';
import { MarioComponent } from './mario/mario.component';
import { HomeComponent } from './home/home.component';
import { MobileappComponent } from './mobileapp/mobileapp.component';
import { OrdersComponent } from './mobileapp/routes/orders.component';
import { TravelsComponent } from './mobileapp/routes/travels.component';
import { AbosComponent } from './mobileapp/routes/abos.component';
import { ProfileComponent } from './mobileapp/profile/profile.component';
import { TicketsOverviewComponent } from './mobileapp/tickets/tickets-overview/tickets-overview.component';
import { PaymentsOverviewComponent } from './mobileapp/payments/payments-overview/payments-overview.component';
import { NAchtNComponent } from './nAchtN/nAchtN.component';

export const appRoutes: Route[] = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'examples', component: ExamplesComponent },
  { path: 'mario', component: MarioComponent },
  { path: 'nachtn', component: NAchtNComponent },

  {
    path: 'mobileapp',
    component: MobileappComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'tickets', component: TicketsOverviewComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'travels', component: TravelsComponent },
      { path: 'paymentmethods', component: PaymentsOverviewComponent },
      { path: 'abos', component: AbosComponent }
    ]
  },
];
