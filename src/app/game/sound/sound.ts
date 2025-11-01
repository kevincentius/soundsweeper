
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
};
export const soundDataMap: Record<string, SoundData> = soundData;
