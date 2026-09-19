const PLUGIN_NAME = 'ChantSpeech';

function nativePlugin() {
  const capacitor = globalThis.Capacitor ?? globalThis.window?.Capacitor;
  if (!capacitor?.isNativePlatform?.() || capacitor.getPlatform?.() !== 'ios') return null;
  if (capacitor.isPluginAvailable?.(PLUGIN_NAME) === false) return null;
  return capacitor.Plugins?.[PLUGIN_NAME]
    ?? capacitor.registerPlugin?.(PLUGIN_NAME)
    ?? null;
}

function unavailableError() {
  const error = new Error('Speech recitation is available in the iPhone/iPad app.');
  error.code = 'native_speech_unavailable';
  return error;
}

export async function getChantSpeechAvailability() {
  const plugin = nativePlugin();
  if (!plugin?.getAvailability) {
    return { native: false, available: false, speechPermission: 'unavailable', microphonePermission: 'unavailable' };
  }
  try {
    return { native: true, ...await plugin.getAvailability() };
  } catch {
    return { native: true, available: false, speechPermission: 'unknown', microphonePermission: 'unknown' };
  }
}

export async function requestChantSpeechPermissions(options = {}) {
  const plugin = nativePlugin();
  if (!plugin?.requestPermissions) throw unavailableError();
  return plugin.requestPermissions(options);
}

export async function startChantSpeech(options) {
  const plugin = nativePlugin();
  if (!plugin?.startListening) throw unavailableError();
  return plugin.startListening(options);
}

export async function stopChantSpeech() {
  const plugin = nativePlugin();
  if (!plugin?.stopListening) return;
  await plugin.stopListening();
}

export async function cancelChantSpeech() {
  const plugin = nativePlugin();
  if (!plugin?.cancelListening) return;
  await plugin.cancelListening();
}

export async function addChantSpeechListener(eventName, listener) {
  const plugin = nativePlugin();
  if (!plugin?.addListener) throw unavailableError();
  return plugin.addListener(eventName, listener);
}

export async function removeChantSpeechListeners(handles) {
  await Promise.all((handles ?? []).map(async (handle) => {
    try { await handle?.remove?.(); } catch {
      // Native listeners may already be released during WebView teardown.
    }
  }));
}
