import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  AfterViewInit,
  PLATFORM_ID,
  OnInit,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import {
  VoiceCommandService,
  VoiceState,
} from '../../data/voice-command.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice-command',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <button
      mat-fab
      [color]="getButtonColor()"
      [class.listening]="voiceState.isListening"
      [class.pulse]="voiceState.isListening"
      [disabled]="!voiceState.isSupported"
      [matTooltip]="getTooltipText()"
      (click)="toggleListening()"
      aria-label="Voice command button"
    >
      <mat-icon>{{ getIconName() }}</mat-icon>
    </button>
  `,
  styles: [
    `
      :host {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1000;
      }

      .mat-mdc-fab {
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .mat-mdc-fab:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
      }

      .mat-mdc-fab.listening {
        animation: pulse 1.5s infinite;
      }

      .pulse {
        animation: pulse 1.5s infinite;
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        50% {
          transform: scale(1.1);
          box-shadow: 0 8px 16px rgba(63, 81, 181, 0.4);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
      }

      .mat-mdc-fab:disabled {
        opacity: 0.5;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoiceCommandComponent implements OnInit, OnDestroy, AfterViewInit {
  ngOnInit(): void {
    // Initialize voice command service after view is ready
    this.voiceService.initialize(this.platformId);

    // Subscribe to voice state changes
    this.voiceService.voiceState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        console.info('Got state:', state);
        this.voiceState = state;

        // Show error messages
        if (state.error) {
          this.showMessage(state.error, 'error');
        }
      });

    // Subscribe to successful command executions
    this.voiceService.commandExecuted$
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const description =
          result.command.action === 'navigate'
            ? `Navigation: ${result.command.description}`
            : `${result.command.description}${
              result.extractedText ? `: ${result.extractedText}` : ''
            }`;
        this.showMessage(description, 'success');
      });

    // Show welcome message if voice is supported
    if (this.voiceService.isVoiceSupported()) {
      setTimeout(() => {
        this.showMessage(
          'Voice commands ready! Click the microphone to start.',
          'info'
        );
      }, 1000);
    }
  }
  private voiceService = inject(VoiceCommandService);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();
  private platformId = inject(PLATFORM_ID);

  voiceState: VoiceState = {
    isListening: false,
    isSupported: false,
    lastCommand: null,
    error: null,
  };

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleListening(): void {
    if (this.voiceState.isListening) {
      this.voiceService.stopListening();
    } else {
      this.voiceService.startListening();
      this.showMessage(
        'Listening... Try saying "go to tasks" or "show workouts"',
        'info'
      );
    }
  }

  getButtonColor(): string {
    if (!this.voiceState.isSupported) return '';
    if (this.voiceState.error) return 'warn';
    if (this.voiceState.isListening) return 'accent';
    return 'primary';
  }

  getIconName(): string {
    if (!this.voiceState.isSupported) return 'mic_off';
    if (this.voiceState.isListening) return 'mic';
    return 'mic_none';
  }

  getTooltipText(): string {
    if (!this.voiceState.isSupported) {
      return 'Voice commands not supported in this browser';
    }
    if (this.voiceState.isListening) {
      return 'Listening... Click to stop';
    }
    return 'Click to start voice commands';
  }

  private showMessage(
    message: string,
    type: 'success' | 'error' | 'info'
  ): void {
    const config = {
      duration: type === 'error' ? 5000 : 3000,
      panelClass: [`snackbar-${type}`],
    };

    this.snackBar.open(message, 'Dismiss', config);
  }
}
