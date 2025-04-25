import { Component, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LinkedSignalComponent } from './linked-signal/linked-signal.component';
import { SignalsComponent } from './signals/signals.component';
import { AvoidComponent } from './effects/avoid.component';
import { CardViewComponent } from './card-view/card-view.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { GoogleMapsComponent } from './google-maps/google-maps.component';
import { ScreenComponent } from './screen/screen.component';

@Component({
  selector: 'app-examples',
  imports: [
    MatTabGroup,
    MatTab,
    LinkedSignalComponent,
    SignalsComponent,
    AvoidComponent,
    CardViewComponent,
    VideoPlayerComponent,
    GoogleMapsComponent,
    ScreenComponent,
  ],
  templateUrl: './examples.component.html',
  styleUrl: './examples.component.scss',
})
export class ExamplesComponent {
  selectedTabIndex = signal(0);
}
