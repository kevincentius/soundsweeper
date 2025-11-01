import { Component } from '@angular/core';
import { soundData, SoundData, soundDataMap } from '../../game/sound/sound';
import { soundService } from '../../game/sound/sound-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credits-component',
  imports: [CommonModule],
  templateUrl: './credits-component.html',
  styleUrl: './credits-component.scss',
})
export class CreditsComponent {
  soundService = soundService;
  soundDataList: SoundData[] = Object.keys(soundData).map(key => soundDataMap[key]);
  constructor() {}
}
