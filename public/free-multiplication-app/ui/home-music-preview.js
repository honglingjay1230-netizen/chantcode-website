export const HOME_FULL_MUSIC_PREVIEW_LIMIT = 3;
export const HOME_FULL_MUSIC_PREVIEW_STORE = 'chantcode.home-full-music-preview-plays.v1';

function normalizePlayCount(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return 0;
  return Math.min(HOME_FULL_MUSIC_PREVIEW_LIMIT, Math.max(0, parsed));
}

export function loadHomeFullMusicPreviewPlays(storage = globalThis.localStorage) {
  try {
    return normalizePlayCount(storage?.getItem(HOME_FULL_MUSIC_PREVIEW_STORE));
  } catch {
    return 0;
  }
}

export function getHomeFullMusicPreviewRemaining(storage = globalThis.localStorage) {
  return HOME_FULL_MUSIC_PREVIEW_LIMIT - loadHomeFullMusicPreviewPlays(storage);
}

export function recordHomeFullMusicPreviewPlay(storage = globalThis.localStorage) {
  const next = Math.min(HOME_FULL_MUSIC_PREVIEW_LIMIT, loadHomeFullMusicPreviewPlays(storage) + 1);
  try { storage?.setItem(HOME_FULL_MUSIC_PREVIEW_STORE, String(next)); } catch {}
  return next;
}
