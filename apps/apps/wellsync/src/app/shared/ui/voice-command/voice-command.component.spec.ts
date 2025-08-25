import { ComponentFixture } from '@angular/core/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VoiceCommandComponent } from './voice-command.component';
import { VoiceCommandService } from '../../data/voice-command.service';
import { of } from 'rxjs';

describe('VoiceCommandComponent', () => {
  let fixture: ComponentFixture<VoiceCommandComponent>;
  let component: VoiceCommandComponent;
  let voiceServiceMock: jasmine.SpyObj<VoiceCommandService>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    voiceServiceMock = jasmine.createSpyObj(
      'VoiceCommandService',
      ['startListening', 'stopListening', 'isVoiceSupported'],
      {
        voiceState$: of({
          isListening: false,
          isSupported: true,
          lastCommand: null,
          error: null,
        }),
        commandExecuted$: of(),
      }
    );

    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    await MockBuilder(VoiceCommandComponent)
      .mock(VoiceCommandService, voiceServiceMock)
      .mock(MatSnackBar, snackBarMock);

    fixture = MockRender(VoiceCommandComponent);
    component = ngMocks.findInstance(VoiceCommandComponent);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start listening when button is clicked and not listening', () => {
    component.voiceState.isListening = false;
    component.voiceState.isSupported = true;

    component.toggleListening();

    expect(voiceServiceMock.startListening).toHaveBeenCalled();
  });

  it('should stop listening when button is clicked and already listening', () => {
    component.voiceState.isListening = true;
    component.voiceState.isSupported = true;

    component.toggleListening();

    expect(voiceServiceMock.stopListening).toHaveBeenCalled();
  });

  it('should return correct button color based on state', () => {
    component.voiceState.isSupported = false;
    expect(component.getButtonColor()).toBe('');

    component.voiceState.isSupported = true;
    component.voiceState.error = 'Some error';
    expect(component.getButtonColor()).toBe('warn');

    component.voiceState.error = null;
    component.voiceState.isListening = true;
    expect(component.getButtonColor()).toBe('accent');

    component.voiceState.isListening = false;
    expect(component.getButtonColor()).toBe('primary');
  });

  it('should return correct icon name based on state', () => {
    component.voiceState.isSupported = false;
    expect(component.getIconName()).toBe('mic_off');

    component.voiceState.isSupported = true;
    component.voiceState.isListening = true;
    expect(component.getIconName()).toBe('mic');

    component.voiceState.isListening = false;
    expect(component.getIconName()).toBe('mic_none');
  });
});
