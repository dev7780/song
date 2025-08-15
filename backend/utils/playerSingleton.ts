// utils/playerSingleton.ts
import { Audio } from 'expo-av';

let soundInstance: Audio.Sound | null = null;
let currentSongId: string | null = null;

export const setGlobalAudio = (sound: Audio.Sound, id: string) => {
  soundInstance = sound;
  currentSongId = id;
};

export const getGlobalAudio = () => soundInstance;
export const getGlobalSongId = () => currentSongId;

export const resetGlobalAudio = async () => {
  if (soundInstance) {
    await soundInstance.stopAsync();
    await soundInstance.unloadAsync();
    soundInstance = null;
    currentSongId = null;
  }
};

