import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { VoiceCommandService } from './voice-command.service';

describe('VoiceCommandService', () => {
  let service: VoiceCommandService;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        VoiceCommandService,
        { provide: Router, useValue: routerMock },
      ],
    });

    service = TestBed.inject(VoiceCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return available commands', () => {
    const commands = service.getAvailableCommands();
    expect(commands.length).toBeGreaterThan(0);
    expect(commands.some((cmd) => cmd.command === 'tasks')).toBe(true);
    expect(commands.some((cmd) => cmd.command === 'workouts')).toBe(true);
    expect(commands.some((cmd) => cmd.command === 'meditation')).toBe(true);
  });

  it('should initialize with correct default state', () => {
    service.voiceState$.subscribe((state) => {
      expect(state.isListening).toBe(false);
      expect(state.lastCommand).toBe(null);
      expect(state.error).toBe(null);
    });
  });

  it('should check voice support', () => {
    const isSupported = service.isVoiceSupported();
    expect(typeof isSupported).toBe('boolean');
  });
});
