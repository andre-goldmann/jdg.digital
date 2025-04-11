import { Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { SignalsComponent } from './signals/signals.component';
import { AvoidComponent } from './effects/avoid.component';

@Component({
  selector: 'app-examples',
  imports: [
    MatTabGroup,
    MatTab,
    LinkedSignalComponent,
    SignalsComponent,
    AvoidComponent,
  ],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss',
})
export class ExamplesComponent {}
