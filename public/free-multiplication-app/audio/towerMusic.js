let towerMusic = null;
let unlockPending = false;

function clearUnlockListeners() {
  if (!unlockPending) return;
  unlockPending = false;
  document.removeEventListener('pointerdown', retryAfterInteraction);
  document.removeEventListener('keydown', retryAfterInteraction);
}

function retryAfterInteraction() {
  clearUnlockListeners();
  towerMusic?.play().catch(() => {});
}

function waitForInteraction() {
  if (unlockPending) return;
  unlockPending = true;
  document.addEventListener('pointerdown', retryAfterInteraction, { once: true });
  document.addEventListener('keydown', retryAfterInteraction, { once: true });
}

function getTowerMusic(source) {
  if (towerMusic === null) {
    towerMusic = new Audio(source);
    towerMusic.loop = true;
    towerMusic.preload = 'auto';
    towerMusic.volume = 0.35;
  }
  return towerMusic;
}

export function playTowerMusic(source) {
  const music = getTowerMusic(source);
  music.play().then(clearUnlockListeners).catch(waitForInteraction);
}

export function pauseTowerMusic() {
  clearUnlockListeners();
  towerMusic?.pause();
}

export function stopTowerMusic() {
  clearUnlockListeners();
  if (!towerMusic) return;
  towerMusic.pause();
  towerMusic.currentTime = 0;
}
