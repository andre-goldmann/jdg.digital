import { Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { SignalsComponent } from './signals/signals.component';

@Component({
  selector: 'app-examples',
  imports: [MatTabGroup, MatTab, LinkedSignalComponent, SignalsComponent],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss',
})
export class ExamplesComponent {}
