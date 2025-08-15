import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MeditationStore } from '../../data/meditation.store';
import { NavBarComponent } from '../../../shared/ui/nav-bar/nav-bar.component';

@Component({
  selector: 'app-meditation-section',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    NavBarComponent,
  ],
  templateUrl: './meditation-section.component.html',
  styleUrls: ['./meditation-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeditationSectionComponent implements OnInit {
  readonly meditationStore = inject(MeditationStore);

  ngOnInit(): void {
    this.meditationStore.loadSessions();
  }

  beginSession(id: string): void {
    this.meditationStore.beginSession(id);
  }

  startReflection(): void {
    this.meditationStore.startReflection();
  }

  getMeditationTypeClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      'Guided Meditation': 'guided',
      'Breathing Exercise': 'breathing',
      'Body Scan': 'body-scan',
      'Quick Session': 'quick',
    };

    return typeMap[type] || 'default';
  }
}
