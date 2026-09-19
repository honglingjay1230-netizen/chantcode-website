const VIDEO_ORIENTATION_PLUGIN = 'VideoOrientation';
let orientationOperation = Promise.resolve(false);

function getVideoOrientationPlugin() {
  const capacitor = globalThis.Capacitor;
  const isNativeIOS = Boolean(
    capacitor?.isNativePlatform?.()
    && capacitor?.getPlatform?.() === 'ios'
  );

  if (!isNativeIOS) return null;

  return capacitor.Plugins?.[VIDEO_ORIENTATION_PLUGIN]
    ?? capacitor.registerPlugin?.(VIDEO_ORIENTATION_PLUGIN)
    ?? null;
}

function runOrientationOperation(method) {
  orientationOperation = orientationOperation.catch(() => false).then(async () => {
    try {
      const plugin = getVideoOrientationPlugin();
      if (!plugin?.[method]) return false;
      const result = await plugin[method]();
      return result?.applied !== false;
    } catch {
      return false;
    }
  });
  return orientationOperation;
}

export function lockVideoLandscape() {
  return runOrientationOperation('lockLandscape');
}

export function lockGameLandscape() {
  return runOrientationOperation('lockPhoneLandscape');
}

export function restorePhonePortrait() {
  return runOrientationOperation('lockPortrait');
}

export function unlockVideoOrientation() {
  return runOrientationOperation('unlock');
}
