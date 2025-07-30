import {
  Component,
  inject,
  OnInit,
  NgZone,
  ElementRef,
  ViewChild,
  signal
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  imports: [
    RouterModule,
    MatSlideToggleModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
})
export class AppComponent implements OnInit {

  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  recognition: any;
  recognizing = false;
  buttonLabel = 'Click to Speak';
  ngZone: NgZone = inject(NgZone);
  private dialog = inject(MatDialog);

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionApi =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionApi();
      //this.recognition.lang = 'en-US';
      this.recognition.continuous = true;

      this.recognition.onend = () => {
        this.reset();
      };

      this.recognition.onresult = (event: any) => {
        this.ngZone.run(() => {
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              this.textareaRef.nativeElement.value +=
                event.results[i][0].transcript;
            }
          }
        });
      };
      // Try to use: https://github.com/angular-a11y/voicecapture-angular
      // Show confirmation dialog before playing welcome message, this is neccessary, because
      // browsers block autoplay of audio without user interaction.
      this.showWelcomeDialog();

      // For speaking


    }
  }

  /**
   * Shows a confirmation dialog and plays welcome message if confirmed
   */
  showWelcomeDialog() {
    import('./welcome-dialog.component').then(({ WelcomeDialogComponent }) => {
      const dialogRef = this.dialog.open(WelcomeDialogComponent, {
        width: '350px',
        disableClose: false,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // User confirmed, play welcome message
          //    this.playWelcomeMessage();

          const message = new SpeechSynthesisUtterance('Welcome to past. How can I help you?');
          window.speechSynthesis.speak(message);

          this.recognition.onresult = (event:any) => {
            const text = event.results[0][0].transcript.toLowerCase();
            if (text.includes('continue')) { console.info('Continue'); this.recognition.stop(); this.recognizing = false;}
            if (text.includes('cancel')) { console.info('Cancel'); this.recognition.stop(); this.recognizing = false;}
          };
          this.recognition.start();

        }
      });
    });
  }

  /**
   * Calls the text-to-speech API with a welcome message and plays the audio
   * Creates wav file (of the given text on the server) and plays it in the browser.
  playWelcomeMessage() {
    this.http
      .post(
        '/api/text-to-speech',
        { text: 'Welcome to Past' },
        { responseType: 'blob' }
      )
      .subscribe({
        next: (audioBlob: Blob) => {
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          const promise = audio.play();
          if (promise !== undefined) {
            promise
              .then(() => {
                console.info('Autoplay started!');
              })
              .catch((playError) => {
                console.error('Autoplay was prevented:', playError);
                // Show a "Play" button so that user can start playback.
              });
          }
        },
        error: (error) => {
          console.error('Failed to get welcome message audio:', error);
        },
      });
  }
   */
  reset() {
    this.recognizing = false;
    this.buttonLabel = 'Click to Speak';
  }

  toggleStartStop() {
    this.textareaRef.nativeElement.value = ''; // Clear the textarea
    if (this.recognizing) {
      this.recognition.stop();
      this.reset();
    } else {
      this.recognition.start();
      this.recognizing = true;
      this.buttonLabel = 'Click to Stop';
    }
  }
}
