const activeAudio = new Audio();
let volume = 0.8;
let playbackId = 0;
let feedbackTimer = null;

const AUDIO_PLAYBACK_ERROR_MESSAGE = 'Audio is temporarily unavailable. Please try again.';

const AUDIO_ROOT = '/free-multiplication-app/audio/chants';
const NUMBER_ROOT = `${AUDIO_ROOT}/数字`;
const CHANT_ROOT = `${AUDIO_ROOT}/乘法口诀`;
const FOUNDATION_CHANT_ROOT = `${CHANT_ROOT}/04_foundation_sentences`;
const LISTEN_CHOOSE_ROOT = `${CHANT_ROOT}/05_listen_choose`;

const tensNames = {
  10: 'onety',
  20: 'twenty',
  30: 'thirty',
  40: 'forty',
  50: 'fifty',
  60: 'sixty',
  70: 'seventy',
  80: 'eighty',
  90: 'ninety',
};

function numberAudioPaths(number) {
  const normalizedNumber = Math.trunc(Number(number));
  if (normalizedNumber < 1 || normalizedNumber > 99) return [];
  if (normalizedNumber <= 10) return [`${NUMBER_ROOT}/1-10/${normalizedNumber}.wav`];
  const tens = Math.floor(normalizedNumber / 10) * 10;
  const units = normalizedNumber % 10;
  const paths = [`${NUMBER_ROOT}/10-90-tens/${tens}_${tensNames[tens]}.wav`];
  if (units > 0) paths.push(`${NUMBER_ROOT}/1-10/${units}.wav`);
  return paths;
}

function showAudioPlaybackError() {
  if (typeof document === 'undefined' || !document.body) return;
  let feedback = document.querySelector('[data-audio-feedback]');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'audio-feedback';
    feedback.dataset.audioFeedback = '';
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    document.body.appendChild(feedback);
  }
  feedback.textContent = AUDIO_PLAYBACK_ERROR_MESSAGE;
  feedback.hidden = false;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => { feedback.hidden = true; }, 3200);
}

function failPlayback(currentPlaybackId, onError) {
  if (currentPlaybackId !== playbackId) return;
  playbackId += 1;
  activeAudio.pause();
  activeAudio.onended = null;
  activeAudio.ontimeupdate = null;
  activeAudio.onerror = null;
  activeAudio.removeAttribute('src');
  showAudioPlaybackError();
  onError?.();
}

function playSequence(paths, index = 0, currentPlaybackId = playbackId, callbacks = {}) {
  if (currentPlaybackId !== playbackId) return;
  if (index >= paths.length) {
    activeAudio.onended = null;
    activeAudio.onerror = null;
    callbacks.onEnded?.();
    return;
  }
  activeAudio.src = paths[index];
  activeAudio.currentTime = 0;
  activeAudio.volume = volume;
  activeAudio.onended = () => playSequence(paths, index + 1, currentPlaybackId, callbacks);
  activeAudio.onerror = () => failPlayback(currentPlaybackId, callbacks.onError);
  activeAudio.play().catch(() => failPlayback(currentPlaybackId, callbacks.onError));
}

export function setVolume(nextVolume) {
  volume = nextVolume;
  activeAudio.volume = volume;
}

export function stopVoice() {
  playbackId += 1;
  activeAudio.pause();
  activeAudio.onended = null;
  activeAudio.ontimeupdate = null;
  activeAudio.onerror = null;
  activeAudio.removeAttribute('src');
}

export function multiplicationFactAudioPath(left, right) {
  const first = Math.min(Number(left), Number(right));
  const second = Math.max(Number(left), Number(right));
  const answer = first * second;
  let path = '';

  if (first === 1 && second <= 9) {
    path = `${FOUNDATION_CHANT_ROOT}/group_01/mul_01x${String(second).padStart(2, '0')}_${String(answer).padStart(3, '0')}.wav`;
  } else if (second === 10 && first >= 1 && first <= 9) {
    path = `${FOUNDATION_CHANT_ROOT}/group_10/mul_${String(first).padStart(2, '0')}x10_${String(answer).padStart(3, '0')}.wav`;
  } else if (first >= 2 && second <= 9) {
    path = `${CHANT_ROOT}/01_36_sentences/group_${String(first).padStart(2, '0')}/mul_${String(first).padStart(2, '0')}x${String(second).padStart(2, '0')}_${String(answer).padStart(3, '0')}.wav`;
  }

  return path;
}

export function playMultiplicationFact(left, right, callbacks = {}) {
  const path = multiplicationFactAudioPath(left, right);

  if (!path) return;
  stopVoice();
  playSequence([path], 0, playbackId, callbacks);
}

export function playNumberAudio(number) {
  const normalizedNumber = Math.trunc(Number(number));
  if (normalizedNumber < 1 || normalizedNumber > 99) return;
  stopVoice();
  playSequence(numberAudioPaths(normalizedNumber));
}

export function playListenChoosePrompt(left, right, callbacks = {}) {
  const first = Math.min(Number(left), Number(right));
  const second = Math.max(Number(left), Number(right));
  const answer = first * second;
  const factKey = `${first}x${second}`;
  const specialFileNames = {
    '1x1': 'mul_01x01_001_first_two_numbers.wav',
    '1x2': 'mul_01x02_002_first_two_numbers.wav',
    '1x3': 'mul_01x03_003_first_two_numbers.wav',
    '1x4': 'mul_01x04_004_first_two_numbers.wav',
    '1x5': 'mul_01x05_005_first_two_numbers.wav',
    '1x6': 'mul_01x06_006_first_two_numbers.wav',
    '1x7': 'mul_01x07_007_first_two_numbers.wav',
    '1x8': 'mul_01x08_008_first_two_numbers.wav',
    '1x9': 'mul_01x09_009_first_two_numbers.wav',
    '1x10': 'mul_01x10_010_two_numbers_only.wav',
    '2x10': 'mul_02x10_020_two_numbers_only.wav',
    '3x3': 'mul_03x03_three_three_is.wav',
    '3x10': 'mul_03x10_030_two_numbers_only.wav',
    '4x10': 'mul_04x10_040_two_numbers_only.wav',
    '5x10': 'mul_05x10_050_two_numbers_only.wav',
    '6x8': 'mul_06x08_048_first_1s.wav',
    '6x10': 'mul_06x10_060_two_numbers_only.wav',
    '7x10': 'mul_07x10_070_two_numbers_only.wav',
    '8x10': 'mul_08x10_080_two_numbers_only.wav',
    '9x10': 'mul_09x10_090_two_numbers_only.wav',
  };
  const fileName = specialFileNames[factKey]
    ?? `mul_${String(first).padStart(2, '0')}x${String(second).padStart(2, '0')}_${String(answer).padStart(3, '0')}.wav`;
  const group = second === 10 ? 10 : first === 1 ? 1 : first;
  const path = `${LISTEN_CHOOSE_ROOT}/group_${String(group).padStart(2, '0')}/${fileName}`;
  stopVoice();
  playSequence([path], 0, playbackId, callbacks);
}

export function playGroupFactsSequentially(group, callbacks = {}) {
  const normalizedGroup = Number(group);

  if (normalizedGroup < 1 || normalizedGroup > 10) return;

  const facts = Array.from(
    { length: normalizedGroup === 10 ? 9 : 10 - normalizedGroup },
    (_, index) => {
      const left = normalizedGroup === 10 ? index + 1 : normalizedGroup;
      const right = normalizedGroup === 10 ? 10 : normalizedGroup + index;
      const answer = left * right;

      return {
        left,
        right,
        answer
      };
    }
  );

  stopVoice();
  const currentPlaybackId = playbackId;

  const playFactAt = (index) => {
    if (currentPlaybackId !== playbackId) return;
    if (index >= facts.length) {
      activeAudio.onended = null;
      activeAudio.onerror = null;
      callbacks.onEnded?.();
      return;
    }

    const fact = facts[index];

    let path;
    if (fact.left === 1) {
      path = `${FOUNDATION_CHANT_ROOT}/group_01/mul_01x${String(fact.right).padStart(2, '0')}_${String(fact.answer).padStart(3, '0')}.wav`;
    } else if (fact.right === 10) {
      path = `${FOUNDATION_CHANT_ROOT}/group_10/mul_${String(fact.left).padStart(2, '0')}x10_${String(fact.answer).padStart(3, '0')}.wav`;
    } else {
      path =
        `${CHANT_ROOT}/01_36_sentences/` +
        `group_${String(fact.left).padStart(2, '0')}/` +
        `mul_${String(fact.left).padStart(2, '0')}` +
        `x${String(fact.right).padStart(2, '0')}_` +
        `${String(fact.answer).padStart(3, '0')}.wav`;
    }

    callbacks.onSentenceStart?.(index, fact);

    activeAudio.src = path;
    activeAudio.currentTime = 0;
    activeAudio.volume = volume;

    activeAudio.onended = () => {
      playFactAt(index + 1);
    };

    activeAudio.onerror = () => {
      failPlayback(currentPlaybackId, callbacks.onError);
    };

    activeAudio.play().catch(() => {
      failPlayback(currentPlaybackId, callbacks.onError);
    });
  };

  playFactAt(0);
}
