import { Component } from '@angular/core';
import { LevelComponent } from './level/level.component';

@Component({
  selector: 'app-mario',
  imports: [LevelComponent],
  templateUrl: './mario.component.html',
  styleUrl: './mario.component.scss',
})
export class MarioComponent {}
