const STORE = 'chantcode.progress.v1';
export const CURRENT_SCHEMA_VERSION = 6;

const GROUPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const RECITATION_RESULT_KEYS = new Set([
  ...Array.from({ length: 8 }, (_, index) => `group-${index + 2}`),
  'groups-2-4',
  'groups-5-9',
  'groups-2-9',
]);

const groupDefaults = Object.fromEntries(
  GROUPS.flatMap((group) => [
    [`learn${group}`, false],
    [`test${group}`, false],
    [`game${group}`, false],
    [`towerMistakes${group}`, null],
    [`lastAccuracy${group}`, 0],
    [`mastered${group}`, 0],
    [`verified${group}`, false],
    [`attempted${group}`, false],
    [`bareRecite${group}`, false],
  ])
);

const defaults = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  volume: 0.8,
  fullScreenLandscape: true,
  highestScore: 0,
  completed: false,
  fullUnlocked: false,
  fullPurchased: false,
  video: false,

  ...groupDefaults,

  // 旧试用版 6 + 7 混合阶段，暂时保留，避免现有页面出错
  towerMistakesMixed: null,
  mixed: false,
  mixedTest: false,
  mixedGame: false,
  mixedAttempted: false,
  mixedAccuracy: 0,
  verifiedMixed: false,

  // 完整版第一阶段：2–4组
  combined24: false,
  combined24Accuracy: 0,
  towerMistakes24: null,

  // 完整版第二阶段：5–9组
  combined59: false,
  combined59Accuracy: 0,
  towerMistakes59: null,

  // 完整版最终阶段：2–9组
  combined29: false,
  combined29Accuracy: 0,
  towerMistakes29: null,

  // 旧版 Apple Speech 综合背诵结果；保留以兼容已安装版本的本地进度。
  recitation24: false,
  recitation59: false,
  recitation29: false,

  // 家长最终背诵核查。单组继续使用 bareReciteX，组合范围使用以下独立字段。
  parentRecitation24: false,
  parentRecitation59: false,
  parentRecitation29: false,

  // Coach / independent recitation results; parent confirmation remains in bareReciteX.
  recitationResults: {},

  // 有标准音频提示的语音跟读识别星星；与无提示裸背进度分开保存。
  spokenAnswerPassed: {},

  // 完整版综合塔防
  fullTower24: false,
  towerMistakesFull24: null,
  fullTower59: false,
  towerMistakesFull59: null,
  fullTower29: false,
  towerMistakesFull29: null,
  fullTower29Speed: false,
  towerMistakesFull29Speed: null,

  commutativeHintSeen: false,
};

const booleanFields = [
  'completed',
  'fullUnlocked',
  'fullPurchased',
  'video',
  'fullScreenLandscape',
  'mixed',
  'mixedTest',
  'mixedGame',
  'verifiedMixed',
  'combined24',
  'combined59',
  'combined29',
  'recitation24',
  'recitation59',
  'recitation29',
  'parentRecitation24',
  'parentRecitation59',
  'parentRecitation29',
  'fullTower24',
  'fullTower59',
  'fullTower29',
  'fullTower29Speed',
  'commutativeHintSeen',
  ...GROUPS.flatMap((group) => [
    `learn${group}`,
    `test${group}`,
    `game${group}`,
    `verified${group}`,
    `bareRecite${group}`,
  ]),
];

const accuracyFields = [
  'mixedAccuracy',
  'combined24Accuracy',
  'combined59Accuracy',
  'combined29Accuracy',
  ...GROUPS.map((group) => `lastAccuracy${group}`),
];

const nonNegativeIntegerFields = [
  'highestScore',
  ...GROUPS.map((group) => `mastered${group}`),
];

const mistakeFields = [
  'towerMistakesMixed',
  'towerMistakes24',
  'towerMistakes59',
  'towerMistakes29',
  'towerMistakesFull24',
  'towerMistakesFull59',
  'towerMistakesFull29',
  'towerMistakesFull29Speed',
  ...GROUPS.map((group) => `towerMistakes${group}`),
];

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function toFiniteNumber(value) {
  if (typeof value === 'string' && value.trim() === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeBoolean(value, fallback = false) {
  if (value === true || value === 1 || value === '1') return true;
  if (value === false || value === 0 || value === '0') return false;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
  }
  return fallback;
}

function normalizeRange(value, fallback, minimum, maximum) {
  const number = toFiniteNumber(value);
  if (number === null) return fallback;
  return Math.min(maximum, Math.max(minimum, number));
}

function normalizeNonNegativeInteger(value, fallback = 0) {
  const number = toFiniteNumber(value);
  if (number === null || !Number.isInteger(number) || number < 0) return fallback;
  return number;
}

function normalizeMistakes(value) {
  if (value === null) return null;
  const number = toFiniteNumber(value);
  return number !== null && Number.isInteger(number) && number >= 0 ? number : null;
}

function normalizeSpokenAnswerPassed(value) {
  if (!isRecord(value)) return {};
  const normalized = {};
  Object.entries(value).forEach(([key, passed]) => {
    const match = String(key).toLowerCase().match(/^([2-9])x([2-9])$/);
    if (!match || !normalizeBoolean(passed)) return;
    const left = Number(match[1]);
    const right = Number(match[2]);
    if (left > right) return;
    normalized[`${left}x${right}`] = true;
  });
  return normalized;
}

function normalizeRecitationResults(value) {
  if (!isRecord(value)) return {};
  const normalized = {};

  Object.entries(value).forEach(([modeId, result]) => {
    if (!RECITATION_RESULT_KEYS.has(modeId) || !isRecord(result)) return;
    const completed = normalizeBoolean(result.completed);
    const fluent = completed && normalizeBoolean(result.fluent);
    const mastered = fluent && normalizeBoolean(result.mastered);
    const coachCompleted = completed && normalizeBoolean(result.coachCompleted, completed);
    const independentCompleted = completed && normalizeBoolean(result.independentCompleted, fluent);
    const needsReview = Array.isArray(result.needsReview)
      ? [...new Set(result.needsReview.map((key) => String(key).toLowerCase()).filter((key) => {
        const match = key.match(/^([2-9])x([2-9])$/);
        return Boolean(match && Number(match[1]) <= Number(match[2]));
      }))]
      : [];

    normalized[modeId] = {
      completed,
      coachCompleted,
      independentCompleted,
      fluent,
      mastered,
      needsReview,
      maxPauseMs: normalizeNonNegativeInteger(result.maxPauseMs),
      hesitationCount: normalizeNonNegativeInteger(result.hesitationCount),
      promptCount: normalizeNonNegativeInteger(result.promptCount),
      wrongCount: normalizeNonNegativeInteger(result.wrongCount),
    };
  });

  return normalized;
}

function migrateProgress(source) {
  const version = normalizeNonNegativeInteger(source.schemaVersion, 0);
  if (version === 0) return { ...source, schemaVersion: CURRENT_SCHEMA_VERSION };
  return source;
}

export function normalizeProgress(source) {
  const input = isRecord(source) ? source : {};
  const normalized = { ...defaults };

  normalized.volume = normalizeRange(input.volume, defaults.volume, 0, 1);

  booleanFields.forEach((field) => {
    normalized[field] = normalizeBoolean(input[field], defaults[field]);
  });

  accuracyFields.forEach((field) => {
    normalized[field] = normalizeRange(input[field], defaults[field], 0, 100);
  });

  nonNegativeIntegerFields.forEach((field) => {
    normalized[field] = normalizeNonNegativeInteger(input[field], defaults[field]);
  });

  mistakeFields.forEach((field) => {
    normalized[field] = normalizeMistakes(input[field]);
  });

  normalized.spokenAnswerPassed = normalizeSpokenAnswerPassed(input.spokenAnswerPassed);
  normalized.recitationResults = normalizeRecitationResults(input.recitationResults);

  GROUPS.forEach((group) => {
    const attemptedKey = `attempted${group}`;
    const inferredAttempted = normalized[`test${group}`]
      || normalized[`lastAccuracy${group}`] > 0
      || normalized[`mastered${group}`] > 0;
    normalized[attemptedKey] = normalizeBoolean(input[attemptedKey], inferredAttempted);
  });

  const inferredMixedAttempted = normalized.mixedTest || normalized.mixedAccuracy > 0;
  normalized.mixedAttempted = normalizeBoolean(input.mixedAttempted, inferredMixedAttempted);
  normalized.schemaVersion = CURRENT_SCHEMA_VERSION;

  return normalized;
}

function persistProgress(progress) {
  try {
    globalThis.localStorage.setItem(STORE, JSON.stringify(progress));
  } catch {
    // 存储不可用时继续使用内存中的规范化进度。
    globalThis.dispatchEvent?.(new Event('chantcode-storage-error'));
  }
}

export function loadProgress() {
  try {
    const stored = globalThis.localStorage?.getItem(STORE);
    if (stored === null || stored === undefined) return { ...defaults };

    const parsed = JSON.parse(stored);
    if (!isRecord(parsed)) return { ...defaults };

    const version = normalizeNonNegativeInteger(parsed.schemaVersion, 0);
    // 本地只保留学习数据；购买权限必须由本次运行的 StoreKit 核验重新授予。
    const normalized = normalizeProgress({ ...migrateProgress(parsed), fullUnlocked: false });
    if (version < CURRENT_SCHEMA_VERSION || parsed.fullUnlocked !== false) persistProgress(normalized);
    return normalized;
  } catch {
    return { ...defaults };
  }
}

export function writeProgress(current, patch) {
  const next = normalizeProgress({
    ...normalizeProgress(current),
    ...(isRecord(patch) ? patch : {}),
  });
  persistProgress(next);
  return next;
}

export function resetLearningProgress(current) {
  try { globalThis.localStorage.removeItem('chantcode.web-practice.v1'); } catch { globalThis.dispatchEvent?.(new Event('chantcode-storage-error')); }
  const existing = normalizeProgress(current);
  const next = normalizeProgress({
    fullUnlocked: existing.fullUnlocked,
    fullPurchased: existing.fullPurchased,
    fullScreenLandscape: existing.fullScreenLandscape,
  });
  persistProgress(next);
  return next;
}

export function getBestAccuracy(previousAccuracy, currentAccuracy) {
  const previous = normalizeRange(previousAccuracy, 0, 0, 100);
  const current = normalizeRange(currentAccuracy, 0, 0, 100);
  return Math.max(previous, current);
}
