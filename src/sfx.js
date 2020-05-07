import UiFx from 'uifx';
import alertAudio from './assets/alert.mp3';

export const alert = new UiFx(alertAudio);

export const silentAlertHack = new UiFx(alertAudio);
silentAlertHack.setVolume(0);
silentAlertHack.play();
