
export interface SoundData {
  key: string;
  creditsUrl?: string;
}

// keys must match the file names in public/snd
export const soundData = {
  fire:     { key: 'fire',    creditsUrl: 'https://freesound.org/people/SilverIllusionist/sounds/472688/' },
  growl:    { key: 'growl',   creditsUrl: 'https://freesound.org/people/Elpati%C3%B1o/sounds/706486/'   },
  wing:     { key: 'wing',    creditsUrl: 'https://freesound.org/people/ecfike/sounds/132874/'   },
  cricket:  { key: 'cricket', creditsUrl: 'https://freesound.org/people/Sojan/sounds/400663/'    },

  damage:   { key: 'damage',  creditsUrl: 'https://freesound.org/people/Raclure/sounds/458867/' },
  win:      { key: 'win',     creditsUrl: 'https://freesound.org/people/LittleRobotSoundFactory/sounds/274182/' },
};
export const soundDataMap: Record<string, SoundData> = soundData;
